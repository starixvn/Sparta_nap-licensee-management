/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_Insert]
	@LicenseeName			VARCHAR(50)
	, @SuperWildCard		VARCHAR(100) = ''
	, @LicenseeType			VARCHAR(50) = ''
	, @IsSpecial			BIT = 0
	, @ProductCode			VARCHAR(100) = ''
	, @SystemisActive		VARCHAR(100) = ''
	, @IsAllowMemberComm	BIT = 0
	, @EffectiveDate		DATE = ''
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Set up new licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @ProductPrefix AS TABLE(Id INT IDENTITY(1,1), ProductCode VARCHAR(10))
	
	INSERT INTO @ProductPrefix (ProductCode)  
	SELECT val 
	FROM CUSTDB.dbo.strSplit(@ProductCode,',')
	
	IF EXISTS (
		SELECT 1
		FROM @ProductPrefix pp
		LEFT JOIN dbo.Product3rd p WITH (NOLOCK) ON pp.ProductCode = p.ProductPrefix
		WHERE pp.ProductCode <> 'SB' AND p.Productid IS NULL)
	BEGIN
		RAISERROR ('Invalid product', 16, 1)
		RETURN
	END
	
	DECLARE @XACT_ABORT VARCHAR(3) = 'OFF';  
	IF ( (16384 & @@OPTIONS) = 16384 ) SET @XACT_ABORT = 'ON';  
	
	IF @XACT_ABORT = 'OFF'
	BEGIN
		SET XACT_ABORT ON
	END
	
	BEGIN TRY
	BEGIN TRANSACTION SetUpNewLicensee
		
		DECLARE @ResellerName VARCHAR(50), @tmpSuperWildCard VARCHAR(100)

		IF (@LicenseeType = 'Zelianta')
		BEGIN
			SET @ResellerName = @LicenseeName
		END
		ELSE
		BEGIN
			SET @ResellerName = @LicenseeType
		END

		SET @tmpSuperWildCard = @SuperWildCard + '%'

		EXEC [dbo].[DBA_Lrf_CreateNewLicensee]
			@LicenseeName   		= @LicenseeName
			,@SuperWildCard  	 	= @tmpSuperWildCard
			,@ResellerName   	  	= @ResellerName
			,@IsSpecial      	 	= @IsSpecial
			,@ProductCode	  	 	= @ProductCode
			,@SystemisActive 	  	= @SystemisActive
			,@IsAllowMemberComm     = @IsAllowMemberComm
			,@IsPullService			= 1
			,@EffectiveDate			= @EffectiveDate

	COMMIT TRANSACTION SetUpNewLicensee
	END TRY
	 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION SetUpNewLicensee
			
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