/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_GetLicensee]
	@UserId	INT
AS
/*
	 Created: Amanda
	 Date: 2019-01-23
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190123@Amanda: Get Licensee to assign/unassign for IT user [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	;WITH Licensee_CTE AS (
		SELECT DISTINCT lu.LicenseeId
		FROM dbo.LicenseeUser lu WITH (NOLOCK)
		WHERE lu.UserID = @UserId
		)
	SELECT l.LicenseeName AS Name, CASE WHEN cte.LicenseeId IS NULL THEN 0 ELSE 1 END AS IsAssigned
	FROM dbo.Licensees l WITH (NOLOCK)
	LEFT JOIN Licensee_CTE cte WITH (NOLOCK) ON cte.LicenseeId = l.LicenseeID
	WHERE l.IsActive = 1
	ORDER BY l.LicenseeName
END
GO