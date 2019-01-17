/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_OfferProduct]
	@LicenseeName	VARCHAR(MAX),
	@ProductCode	VARCHAR(MAX),
	@EffectiveDate	DATE =''
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Offer Product from Licensee [Redmine: #83584]
	  - 20190102@Amanda: Modify to support offer multi products for multi licensees [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	EXEC [dbo].[DBA_Lrf_OfferProduct]
		@LicenseeNameList  	= @LicenseeName,
		@ProductCode  		= @ProductCode,
		@EffectiveDate		= @EffectiveDate,
		@IsPullService		= 1
END
GO