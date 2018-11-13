/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_Select]
	@LicenseeName	VARCHAR(50)	= '',
	@IsActive		BIT			= 1,
	@IsLaunched		BIT			= 0,
	@IsAll			BIT			= 1
AS
/*
	 Created: Amanda
	 Date: 2018-11-01
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181101@Amanda: Select Licensees [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT	l.LicenseeID,
			l.LicenseeName,
			l.[Description],
			l.IsDeposit,
			l.AffectedDate,
			l.IsActive,
			l.IsKPIActive,
			l.IsOneWorkActive,
			l.BrandName,
			l.CompanyName,
			l.IsAllowedMemberComm,
			l.EditBetSetting
	FROM dbo.Licensees l WITH(NOLOCK)
	WHERE LicenseeName = @LicenseeName
			OR (
				@IsAll = 1 AND
				(ISNULL(@LicenseeName,'') = '' OR l.LicenseeName LIKE '%' + @LicenseeName + '%')
				AND l.IsActive = @IsActive
				AND (@IsLaunched <> 1 OR l.AffectedDate IS NOT NULL)
			)	
END
GO