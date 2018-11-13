/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_RemoveProduct]
	@LicenseeName	INT,  
	@ProductCode	VARCHAR(5)=''
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
	
	IF ISNULL(@LicenseeID, 0) = 0
	BEGIN
		RAISERROR ('Invalid product', 16, 1)
		RETURN
	END
	
	IF EXISTS (SELECT 1 FROM dbo.LicenseeProduct3rd WITH (NOLOCK) WHERE ProductID = @ProductId AND LicenseeID = @LicenseeId)
	BEGIN
		RETURN
	END

	BEGIN TRY
	BEGIN TRANSACTION LaunchProduct
	
		-- delete setting
		DELETE dbo.LicenseeProduct3rd
		WHERE ProductID = @ProductId AND LicenseeID = @LicenseeId
		
		-- delete permission
		DECLARE @function TABLE (ProductId INT, FunctionId INT, TypeID INT)
		INSERT INTO @function  
		EXEC DBA_Lrf_FunctionProduct @ProductCode = @ProductCode
		
		DELETE lf
		FROM dbo.LicenseeFunctions lf
		INNER JOIN @function f ON f.FunctionId = lf.FunctionId
		WHERE lf.LicenseeId = @LicenseeId AND f.TypeID = 1 -- LRF
		
		DELETE luf
		FROM dbo.LicenseeUserFunctions luf
		INNER JOIN @function f ON f.FunctionId = luf.FunctionId
		WHERE luf.LicenseeId = @LicenseeId AND f.TypeID = 1 -- LRF

	COMMIT TRANSACTION LaunchProduct

	END TRY
	 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION LaunchProduct
			
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
END
GO