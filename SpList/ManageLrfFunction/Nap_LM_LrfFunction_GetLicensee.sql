/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LrfFunction_GetLicensee]
	@FunctionId	INT
AS
/*
	 Created: Amanda
	 Date: 2019-01-17
	 Task: Implement "Manage LRF Function" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190117@Amanda: Get Licensee to assign/unassign function [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	;WITH Licensee_CTE AS (
		SELECT DISTINCT lf.LicenseeId
		FROM dbo.LicenseeFunctions lf WITH (NOLOCK)
		WHERE lf.FunctionId = @FunctionId
		)
	SELECT l.LicenseeName AS Name, CASE WHEN cte.LicenseeId IS NULL THEN 0 ELSE 1 END AS IsAssigned
	FROM dbo.Licensees l WITH (NOLOCK)
	LEFT JOIN Licensee_CTE cte ON cte.LicenseeId = l.LicenseeID
	WHERE l.IsActive = 1
	ORDER BY l.LicenseeName
END
GO