/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_GetLicenseeFunction]
	@UserName	VARCHAR(50),
	@FunctionId INT = 0,
	@LicenseeId INT = 0
AS
/*
	 Created: Amanda
	 Date: 2019-01-25
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190125@Amanda: Get licensees & functions of user [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @UserId INT
	SELECT @UserId = UserId FROM dbo.Users WITH (NOLOCK) WHERE Username = @UserName
	
	SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, lu.isActive AS isActive
	FROM dbo.LicenseeUser lu WITH (NOLOCK)
	INNER JOIN dbo.Licensees l WITH (NOLOCK) ON lu.LicenseeID = l.LicenseeID
	WHERE lu.UserID = @UserId AND l.IsActive = 1 AND (@LicenseeId = 0 OR l.LicenseeID = @LicenseeId)
	
	;WITH CTE_LicenseeFunc AS (
		SELECT DISTINCT l.LicenseeID, lf.FunctionId
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN dbo.LicenseeFunctions lf WITH (NOLOCK) ON l.LicenseeID = lf.LicenseeId
		WHERE l.IsActive = 1
			AND (@LicenseeId = 0 OR l.LicenseeID = @LicenseeId)
			AND (@FunctionId = 0 OR lf.FunctionId = @FunctionId) 
	)
	SELECT lu.LicenseeID, 
			f.FunctionId,
			f.Name AS FunctionName,
			luf.UserFuncionId AS UserFunctionId,
			pf.FunctionId AS ParentId
	FROM dbo.LicenseeUser lu WITH (NOLOCK)
	INNER JOIN CTE_LicenseeFunc cte WITH (NOLOCK) ON lu.LicenseeID = cte.LicenseeID
	INNER JOIN dbo.Functions f WITH (NOLOCK) ON cte.FunctionId = f.FunctionId
	LEFT JOIN dbo.Functions pf WITH (NOLOCK) ON f.ParentId = pf.FunctionId
	LEFT JOIN dbo.LicenseeUserFunctions luf WITH (NOLOCK) ON luf.LicenseeId = lu.LicenseeId AND luf.UserId = lu.UserID AND luf.FunctionId = cte.FunctionId
	WHERE lu.UserID = @UserId
END
GO