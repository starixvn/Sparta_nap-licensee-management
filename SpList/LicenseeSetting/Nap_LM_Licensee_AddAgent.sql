/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_AddAgent]
	@LicenseeName VARCHAR(50)
	, @SuperWildCard VARCHAR(50)
	, @Currency INT = 0
	, @IsSpecial BIT = 0
AS
/*
	 Created: Amanda
	 Date: 2018-11-20
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181120@Amanda: Add Agent/Currency of Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @IsDeposit BIT = 0
	
	SELECT @IsDeposit = IsDeposit
	FROM bodb_Licensee.dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	BEGIN TRY
	BEGIN TRANSACTION AddAgent

		EXEC [DBA_CreateLicenseeAgent]
			@LicenseeName   		= @LicenseeName,
			@SuperWildCard			= @SuperWildCard,
			@Currency  	 			= @Currency,
			@IsSpecial   	  		= @IsSpecial,
			@IsDeposit				= @IsDeposit

	COMMIT TRANSACTION AddAgent
	END TRY
	 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION AddAgent
			
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