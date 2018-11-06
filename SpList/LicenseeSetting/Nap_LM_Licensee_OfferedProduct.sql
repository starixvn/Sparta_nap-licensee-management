/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_OfferedProduct]
	@LicenseeId		BIT			= 0
AS
/*
	 Created: Amanda
	 Date: 2018-11-05
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181105@Amanda: Select Products of Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT	lp.ProductID,
			lp.Comm,
			lp.Winloss,
			lp.EffectiveDate,
			CASE WHEN lp.ProductID = 0 THEN 'SB'
				ELSE p.ProductPrefix END AS ProductCode,
			CASE WHEN lp.ProductID = 0 THEN 'Sportsbook'
				ELSE p.ProductName END AS ProductName
	FROM dbo.LicenseeProduct3rd lp WITH(NOLOCK)
	LEFT JOIN dbo.Product3rd p WITH(NOLOCK) ON lp.ProductID = p.Productid
	WHERE lp.LicenseeID = @LicenseeId

END
GO