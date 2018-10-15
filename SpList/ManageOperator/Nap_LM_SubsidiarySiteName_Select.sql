/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_SubsidiarySiteName_Select]
AS
/*
	 Created: Amanda
	 Date: 2018-09-24
	 Task: Implement "Manage operatorID" function
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20180924@Amanda: Select Lrf Site Name which enable subsidiary  [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT SiteName
	  FROM LicVendorProfile WITH(NOLOCK)
	  WHERE SubsidiaryEnabled = 1
END
GO
