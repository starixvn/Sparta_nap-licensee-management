/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_GetLicensee]
	@UserName	VARCHAR(50),
	@IsAssigned BIT = NULL
AS
/*
	 Created: Amanda
	 Date: 2019-01-23
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190123@Amanda: Get Licensee to assign/unassign for IT user [Redmine: #83584]
	  
	 Developer's Note:
	  - @IsAssigned: 0 - get licensees that user is not assigned
					 1 - get licensees that user is assigned
					 NULL - all
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @UserId INT
	SELECT @UserId = UserId FROM dbo.Users WITH (NOLOCK) WHERE Username = @UserName
	
	IF (@UserId IS NULL)
	BEGIN
		SELECT TOP (0) LicenseeID AS Id, l.LicenseeName AS Name, 0 AS isActive, 0 AS IsAssigned
		FROM dbo.Licensees l WITH (NOLOCK)
		
		RETURN
	END
	
	IF (@IsAssigned IS NULL)
	BEGIN
		;WITH Licensee_CTE AS (
			SELECT lu.LicenseeId, lu.isActive
			FROM dbo.LicenseeUser lu WITH (NOLOCK)
			WHERE lu.UserID = @UserId
		)
		SELECT l.LicenseeID AS Id,
			l.LicenseeName AS Name,
			cte.isActive,
			CASE WHEN cte.LicenseeId IS NULL THEN 0 ELSE 1 END AS IsAssigned
		FROM dbo.Licensees l WITH (NOLOCK)
		LEFT JOIN Licensee_CTE cte ON cte.LicenseeId = l.LicenseeID
		WHERE l.IsActive = 1
		ORDER BY l.LicenseeName
		
		RETURN
	END
	
	IF (@IsAssigned = 1)
	BEGIN
		SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, lu.isActive, 1 AS IsAssigned
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON lu.LicenseeId = l.LicenseeID
		WHERE l.IsActive = 1 AND lu.UserID = @UserId
		ORDER BY l.LicenseeName
		
		RETURN
	END	
	
	SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, 0 AS IsAssigned
	FROM dbo.Licensees l WITH (NOLOCK)
	WHERE l.IsActive = 1 
		AND NOT EXISTS (
			SELECT 1
			FROM dbo.LicenseeUser lu WITH (NOLOCK)
			WHERE lu.UserID = @UserId AND lu.LicenseeID = l.LicenseeID
		)
	ORDER BY l.LicenseeName
END
GO