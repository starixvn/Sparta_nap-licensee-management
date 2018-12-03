/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

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
	
	DECLARE @IsDeposit BIT = 1
	DECLARE @SuperWildCardText VARCHAR(50)
	DECLARE @SumCust1 INT, @SumCust2 INT, @LicenseeId INT
	
	SELECT @IsDeposit = IsDeposit, @LicenseeId = LicenseeID
	FROM bodb_Licensee.dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	SET @SuperWildCardText = @SuperWildCard + '%'

	SELECT @SumCust1 = COUNT(1) FROM dbo.LicenseeCust WITH (NOLOCK) WHERE LicenseeID = @LicenseeID AND RoleID = 2

	EXEC [dbo].[DBA_CreateLicenseeAgent]
		@LicenseeName   		= @LicenseeName,
		@SuperWildCard			= @SuperWildCardText,
		@Currency  	 			= @Currency,
		@IsSpecial   	  		= @IsSpecial,
		@IsDeposit				= @IsDeposit
	
	SELECT @SumCust2 = COUNT(1) FROM dbo.LicenseeCust WITH (NOLOCK) WHERE LicenseeID = @LicenseeID AND RoleID = 2
	
	SELECT @SumCust2 - @SumCust1 AS AffectedRows
END
GO