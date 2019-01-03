USE bodb_Licensee
GO

/*
	Creator: 20180103@Amanda
	Task: LM - Implement 'Manage Product' function [Redmine: #83584]
	Database: DBCUST.bodb_Licensee

	Revisions:
	- 20180103@Joseph: Grant select permission on dbo.LicenseeProduct3rd to bodbLicenseeNet [Redmine: #83584]
*/

GRANT SELECT ON [dbo].[LicenseeProduct3rd] TO [bodbLicenseeNet]