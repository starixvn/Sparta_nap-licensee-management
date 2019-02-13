/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_GetLicensee]
	@UserName	VARCHAR(50) = '',
	@IsAssigned BIT = NULL,
	@SystemId INT = 1 -- LRF
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

	IF (ISNULL(@UserName, '') = '')
	BEGIN
		SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, CAST(0 AS BIT) AS isActive
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN SystemLicensee sl WITH (NOLOCK) ON l.LicenseeID = sl.LicenseeID
		INNER JOIN LicenseeReseller lr WITH (NOLOCK) ON l.LicenseeID = lr.LicenseeID
		INNER JOIN Resellers r WITH (NOLOCK) ON r.ResellerID = lr.ResellerID
		WHERE l.isActive = 1 AND sl.SystemID = @SystemId AND sl.isActive = 1 AND lr.ResellerID <> 3
		GROUP BY l.LicenseeID, l.LicenseeName
		ORDER BY l.LicenseeName
		
		RETURN
	END
	
	DECLARE @UserId INT
	SELECT @UserId = UserId FROM dbo.Users WITH (NOLOCK) WHERE Username = @UserName
	
	IF (@IsAssigned IS NULL)
	BEGIN
		;WITH Licensee_CTE AS (
			SELECT lu.LicenseeId, lu.isActive
			FROM dbo.LicenseeUser lu WITH (NOLOCK)
			WHERE lu.UserID = @UserId
		)
		SELECT l.LicenseeID AS Id,
			l.LicenseeName AS Name,
			CASE WHEN cte.LicenseeId IS NULL THEN CAST(0 AS BIT) ELSE cte.isActive END AS isActive
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN SystemLicensee sl WITH (NOLOCK) ON l.LicenseeID = sl.LicenseeID
		INNER JOIN LicenseeReseller lr WITH (NOLOCK) ON l.LicenseeID = lr.LicenseeID
		INNER JOIN Resellers r WITH (NOLOCK) ON r.ResellerID = lr.ResellerID
		LEFT JOIN Licensee_CTE cte ON cte.LicenseeId = l.LicenseeID
		WHERE l.isActive = 1 AND sl.SystemID = @SystemId AND sl.isActive = 1 AND lr.ResellerID <> 3
		GROUP BY l.LicenseeID, l.LicenseeName, cte.LicenseeId, cte.isActive
		ORDER BY l.LicenseeName
		
		RETURN
	END
	
	IF (@IsAssigned = 1)
	BEGIN
		SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, lu.isActive
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON lu.LicenseeId = l.LicenseeID
		INNER JOIN SystemLicensee sl WITH (NOLOCK) ON l.LicenseeID = sl.LicenseeID
		INNER JOIN LicenseeReseller lr WITH (NOLOCK) ON l.LicenseeID = lr.LicenseeID
		INNER JOIN Resellers r WITH (NOLOCK) ON r.ResellerID = lr.ResellerID
		WHERE l.IsActive = 1 AND lu.UserID = @UserId AND sl.SystemID = @SystemId AND sl.isActive = 1 AND lr.ResellerID <> 3
		GROUP BY l.LicenseeID, l.LicenseeName, lu.isActive
		ORDER BY l.LicenseeName
		
		RETURN
	END	
	
	SELECT l.LicenseeID AS Id, l.LicenseeName AS Name, CAST(0 AS BIT) AS isActive
	FROM dbo.Licensees l WITH (NOLOCK)
	INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON lu.LicenseeId = l.LicenseeID
	INNER JOIN SystemLicensee sl WITH (NOLOCK) ON l.LicenseeID = sl.LicenseeID
	INNER JOIN LicenseeReseller lr WITH (NOLOCK) ON l.LicenseeID = lr.LicenseeID
	INNER JOIN Resellers r WITH (NOLOCK) ON r.ResellerID = lr.ResellerID
	WHERE l.IsActive = 1 AND lu.UserID = @UserId AND sl.SystemID = @SystemId AND sl.isActive = 1 AND lr.ResellerID <> 3
		AND NOT EXISTS (
			SELECT 1
			FROM dbo.LicenseeUser lu WITH (NOLOCK)
			WHERE lu.UserID = @UserId AND lu.LicenseeID = l.LicenseeID
		)
	GROUP BY l.LicenseeID, l.LicenseeName
	ORDER BY l.LicenseeName
END
GO