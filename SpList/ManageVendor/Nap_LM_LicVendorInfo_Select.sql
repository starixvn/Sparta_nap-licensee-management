/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

ALTER PROCEDURE [dbo].[Nap_LM_LicVendorInfo_Select]
	@VendorId VARCHAR(50) = NULL,
	@SiteName VARCHAR(50) = NULL,
	@FunctionKey VARCHAR(50) = NULL
AS
/*
	 Created: Walter
	 Date: 2018-02-12
	 Task: Implement Vendor Info Management
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20180212@Walter: Select Vendor Info [Redmine: #83584]
	  - 20181205@Amanda: Re-order returned column [Redmine: #83584]
	  
	 Example:
	  exec Nap_LM_LicVendorInfo_Select
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT VendorID
		  ,SiteName
		  ,LicenseeType
		  ,PortalUrl
		  ,InternalUrl
		  ,LRF_Url AS LrfUrl
		  ,AffiliateUrl
		  ,IsTest
		  ,SiteId
		  ,Disable
		  ,Exclusions
	  FROM LicVendorProfile WITH(NOLOCK)
	  WHERE (ISNULL(@VendorId,'') = '' OR VendorId = @VendorId) AND 
			(ISNULL(@SiteName, '') = '' OR  SiteName LIKE '%' + @SiteName + '%') AND
			(ISNULL(@FunctionKey,'') = '' OR ISNULL(Exclusions,'') = '' OR Exclusions NOT LIKE '%' + @FunctionKey + '%')
	ORDER BY SiteName ASC
END
GO
