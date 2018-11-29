/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_RemoveProduct]
	@LicenseeName	VARCHAR(50),  
	@ProductCode	VARCHAR(10),
	@PullServiceKey VARCHAR(50)=''
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Remove Product from Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @LicenseeId INT, @ProductId INT
		
	SELECT @LicenseeId = LicenseeID
	FROM dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	IF ISNULL(@LicenseeID, 0) = 0
	BEGIN
		RAISERROR ('Invalid licensee name', 16, 1)
		RETURN
	END

	IF @ProductCode = 'SB'
	BEGIN
		SET @ProductId = 0
	END
	ELSE
	BEGIN
		SELECT @ProductId = Productid
		FROM dbo.Product3rd WITH (NOLOCK)
		WHERE ProductPrefix = @ProductCode
	END
	
	IF ISNULL(@ProductId, 0) = 0
	BEGIN
		RAISERROR ('Invalid product', 16, 1)
		RETURN
	END
	
	IF NOT EXISTS (SELECT 1 FROM dbo.LicenseeProduct3rd WITH (NOLOCK) WHERE ProductID = @ProductId AND LicenseeID = @LicenseeId)
	BEGIN
		SELECT 0
		RETURN
	END

	DECLARE @XACT_ABORT VARCHAR(3) = 'OFF';  
	IF ( (16384 & @@OPTIONS) = 16384 ) SET @XACT_ABORT = 'ON';  
	
	IF @XACT_ABORT = 'OFF'
	BEGIN
		SET XACT_ABORT ON
	END
	
	BEGIN TRY
	BEGIN TRANSACTION RemoveProduct
	
		-- delete setting
		DELETE dbo.LicenseeProduct3rd WITH(ROWLOCK)
		WHERE ProductID = @ProductId AND LicenseeID = @LicenseeId
		
		-- delete permission
		DECLARE @function TABLE (ProductId INT, FunctionId INT, TypeID INT, IsParent BIT)
		INSERT INTO @function(ProductId, FunctionId, TypeID) 
		EXEC DBA_Lrf_FunctionProduct @ProductCode = @ProductCode
		
		UPDATE f
		SET f.IsParent = 1 
		FROM dbo.Functions af WITH (NOLOCK)
		INNER JOIN @function f ON af.FunctionId = f.FunctionId
		WHERE f.TypeID = 1 AND af.ParentId = 0
		
		DELETE lf
		FROM dbo.LicenseeFunctions lf WITH(ROWLOCK)
		INNER JOIN @function f ON f.FunctionId = lf.FunctionId
		WHERE lf.LicenseeId = @LicenseeId AND f.IsParent IS NULL AND f.TypeID = 1 -- LRF
		
		DELETE luf
		FROM dbo.LicenseeUserFunctions luf WITH(ROWLOCK)
		INNER JOIN @function f ON f.FunctionId = luf.FunctionId
		WHERE luf.LicenseeId = @LicenseeId AND f.IsParent IS NULL AND f.TypeID = 1 -- LRF
		
		-- delete parent function
		DECLARE @parentFunction TABLE (Id INT IDENTITY(1,1), FunctionId INT)
		INSERT INTO @parentFunction(FunctionId)
		SELECT FunctionId
		FROM @function
		WHERE IsParent = 1
		
		DECLARE @i INT, @m INT, @parentId INT
		SELECT @i = 1, @m = MAX(Id)
		FROM @parentFunction
		
		WHILE (@i <= @m)
		BEGIN
			SELECT @parentId = FunctionId
			FROM @parentFunction
			WHERE Id = @i
			
			IF NOT EXISTS (
				SELECT TOP(1) 1
				FROM dbo.LicenseeFunctions lf WITH (NOLOCK)
				INNER JOIN dbo.Functions f WITH (NOLOCK) ON lf.FunctionId = f.FunctionId
				WHERE lf.LicenseeId = @LicenseeId AND f.ParentId = @parentId
			)
			BEGIN
				DELETE lf
				FROM dbo.LicenseeFunctions lf WITH(ROWLOCK)
				WHERE lf.LicenseeId = @LicenseeId AND lf.FunctionId = @parentId
				
				DELETE luf
				FROM dbo.LicenseeUserFunctions luf WITH(ROWLOCK)
				WHERE luf.LicenseeId = @LicenseeId AND luf.FunctionId = @parentId
			END		
			
			SET @i = @i + 1
		END
		
		IF (ISNULL(@PullServiceKey, '') <> '' 
			AND EXISTS (SELECT 1 FROM DBPTCS.bodb_PlaytechCS.dbo.LicIntegrationSetting WITH (NOLOCK) WHERE LicenseeID = @LicenseeId AND SettingName = @PullServiceKey))
		BEGIN
			EXEC [DBPTCS].[bodb_PlaytechCS].[dbo].[DBA_Lrf_PullServiceSetting]
				@LicenseeID = @LicenseeId, 
				@LicenseeName = @LicenseeName, 
				@SettingName = @PullServiceKey,
				@IsDelete = 1
		END
		
		SELECT 1

	COMMIT TRANSACTION RemoveProduct

	END TRY
	 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION RemoveProduct
			
		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;

		SELECT
			@ErrorMessage = ERROR_MESSAGE(),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

			RAISERROR (@ErrorMessage, -- Message text.
					   @ErrorSeverity, -- Severity.
					   @ErrorState -- State.
					   );
	END CATCH
	
	IF @XACT_ABORT = 'OFF'
	BEGIN
		SET XACT_ABORT OFF
	END
END
GO