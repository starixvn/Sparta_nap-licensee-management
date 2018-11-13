/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_LaunchProduct]
	@LicenseeName  VARCHAR(10),  
	@ProductCode   VARCHAR(100)='',  
	@EffectiveDate SMALLDATETIME ='' 
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Launch Product of Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	IF NOT EXISTS (SELECT 1 FROM dbo.Licensees WITH (NOLOCK) WHERE LicenseeName = @LicenseeName)
	BEGIN
		RAISERROR ('Invalid licensee name', 16, 1)
		RETURN
	END
	
	IF  @ProductCode <> 'SB' AND NOT EXISTS (SELECT 1 FROM dbo.Product3rd WITH (NOLOCK) WHERE ProductPrefix = @ProductCode)
	BEGIN
		RAISERROR ('Invalid product', 16, 1)
		RETURN
	END

	BEGIN TRY
	BEGIN TRANSACTION LaunchProduct

		EXEC [DBA_Lrf_LaunchProduct]
			@LicenseeName   		= @LicenseeName
			,@ProductCode  	 		= @ProductCode
			,@EffectiveDate   	  	= @EffectiveDate

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