/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LrfFunction_AssignToLicensee]
	@FunctionId	INT,
	@AssignedLicensees VARCHAR(MAX) = '',
	@UnassignedLicensees VARCHAR(MAX) = '',
	@AssignOption INT = 0,
	@RemoveOption INT = 0
AS
/*
	 Created: Amanda
	 Date: 2019-01-22
	 Task: Implement "Manage LRF Function" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190122@Amanda: Assign/Remove function for Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @Result AS TABLE ([Message] VARCHAR(MAX), IsOk BIT, Id INT)
	DECLARE @IsActive BIT
	
	SELECT @IsActive = IsActive FROM dbo.Functions WITH (NOLOCK) WHERE FunctionId = @FunctionId	
	
	IF @IsActive IS NULL
	BEGIN
		INSERT INTO @Result([Message], IsOk, Id)
		VALUES('Function does not exist.', 0, 1)
	END
	ELSE IF @IsActive = 0
	BEGIN
		INSERT INTO @Result([Message], IsOk, Id)
		VALUES('Function is not active.', 0, 2)
	END
	ELSE
	BEGIN
		
		CREATE TABLE #AssignedLicensee (Id INT, Name VARCHAR(50), IsActive BIT, IsAssigned BIT)
		
		IF (ISNULL(@AssignedLicensees,'') <> '')
		BEGIN
			INSERT INTO #AssignedLicensee(Name)
			SELECT DISTINCT val
			FROM CUSTDB.dbo.strSplit(@AssignedLicensees,',')
			
			-- Validate
			UPDATE a
			SET a.Id = l.LicenseeID, a.IsActive = l.IsActive
			FROM #AssignedLicensee a
			INNER JOIN dbo.Licensees l WITH (NOLOCK) ON a.Name = l.LicenseeName
			
			UPDATE a
			SET a.IsAssigned = 1
			FROM #AssignedLicensee a
			INNER JOIN dbo.LicenseeFunctions l WITH (NOLOCK) ON a.Id = l.LicenseeId
			WHERE a.Id IS NOT NULL AND a.IsActive = 1 AND l.FunctionId = @FunctionId
			
			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE Id IS NULL)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- Licensees do not exist.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NULL
				FOR XML PATH('')), 1, 2, '') + ')', 1, 4
			END

			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE Id IS NOT NULL AND IsActive = 0)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- Licensees are not active.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NOT NULL AND IsActive = 0
				FOR XML PATH('')), 1, 2, '') + ')', 1, 5
			END
			
			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE IsAssigned = 1)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- Licensees have been assigned this function before.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE IsAssigned = 1
				FOR XML PATH('')), 1, 2, '') + ')', 1, 6
			END
			
			IF EXISTS (SELECT 1 FROM @Result WHERE Id BETWEEN 4 AND 6)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				VALUES ('This function was not assigned to following licensees:', 1, 3)
			END
			
			DELETE #AssignedLicensee WHERE Id IS NULL OR IsActive = 0 OR IsAssigned = 1
			
			-- Add function for licensee
			INSERT INTO dbo.LicenseeFunctions (FunctionId, LicenseeId)
			SELECT @FunctionId, Id
			FROM #AssignedLicensee
			
			-- Add function for licensee user
			IF (@AssignOption = 1) -- Only add for admin user
			BEGIN
				INSERT INTO dbo.LicenseeUserFunctions (FunctionId, LicenseeId, UserId)
				SELECT @FunctionId, l.Id, lu.UserID
				FROM #AssignedLicensee l
				INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON l.Id = lu.LicenseeID
				INNER JOIN dbo.Users u WITH (NOLOCK) ON u.UserID = lu.UserID
				WHERE lu.isActive = 1 
					AND u.Username IN ( 'administration', 'admin')
					AND u.[Status] = 'Open'
					AND NOT EXISTS (
						SELECT 1 
						FROM dbo.LicenseeUserFunctions luf WITH (NOLOCK) 
						WHERE luf.LicenseeId = l.Id AND luf.UserId = lu.UserID AND luf.FunctionId = @FunctionID)
			END
			ELSE IF (@AssignOption = 2) -- Add for all licensee users
			BEGIN
				INSERT INTO dbo.LicenseeUserFunctions (FunctionId, LicenseeId, UserId)
				SELECT @FunctionId, l.Id, lu.UserID
				FROM #AssignedLicensee l
				INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON l.Id = lu.LicenseeID
				INNER JOIN dbo.Users u WITH (NOLOCK) ON u.UserID = lu.UserID
				WHERE lu.isActive = 1 
					AND u.[Status] = 'Open'
					AND NOT EXISTS (
						SELECT 1 
						FROM dbo.LicenseeUserFunctions luf WITH (NOLOCK) 
						WHERE luf.LicenseeId = l.Id AND luf.UserId = lu.UserID AND luf.FunctionId = @FunctionID)
			END
			
			TRUNCATE TABLE #AssignedLicensee
		END
		
		IF (ISNULL(@UnassignedLicensees,'') <> '')
		BEGIN
			INSERT INTO #AssignedLicensee(Name)
			SELECT DISTINCT val
			FROM CUSTDB.dbo.strSplit(@UnassignedLicensees,',')
			
			-- Validate
			UPDATE a
			SET a.Id = l.LicenseeID, a.IsActive = l.IsActive
			FROM #AssignedLicensee a
			INNER JOIN dbo.Licensees l WITH (NOLOCK) ON a.Name = l.LicenseeName
			
			UPDATE a
			SET a.IsAssigned = 1
			FROM #AssignedLicensee a
			INNER JOIN dbo.LicenseeFunctions l WITH (NOLOCK) ON a.Id = l.LicenseeId
			WHERE a.Id IS NOT NULL AND a.IsActive = 1 AND l.FunctionId = @FunctionId
			
			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE Id IS NULL)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- Licensees do not exist.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NULL
				FOR XML PATH('')), 1, 2, '') + ')', 1, 8
			END
			
			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE Id IS NOT NULL AND IsActive = 0)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- Licensees are not active.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NOT NULL AND IsActive = 0
				FOR XML PATH('')), 1, 2, '') + ')', 1, 9
			END

			IF EXISTS (SELECT TOP(1) 1 FROM #AssignedLicensee WHERE Id IS NOT NULL AND IsActive = 1 AND IsAssigned IS NULL)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				SELECT '- This function is not in licensee function list.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NOT NULL AND IsActive = 1 AND IsAssigned IS NULL
				FOR XML PATH('')), 1, 2, '') + ')', 1, 10
			END
			
			IF EXISTS (SELECT 1 FROM @Result WHERE Id BETWEEN 8 AND 10)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				VALUES ('This function was not removed from following licensees:', 1, 7)
			END
			
			DELETE #AssignedLicensee WHERE IsAssigned IS NULL
			
			-- Remove function from licensee
			DELETE l
			FROM dbo.LicenseeFunctions l WITH (ROWLOCK)
			INNER JOIN #AssignedLicensee a ON l.LicenseeId = a.Id
			WHERE l.FunctionId = @FunctionId
			
			-- Remove function from licensee user
			IF (@RemoveOption = 1)
			BEGIN
				DELETE u
				FROM dbo.LicenseeUserFunctions u WITH (ROWLOCK)
				INNER JOIN #AssignedLicensee a ON u.LicenseeId = a.Id
				WHERE u.FunctionId = @FunctionId
			END
		END
		
		DROP TABLE #AssignedLicensee
	END
	
	
	SELECT [Message], IsOk
	FROM @Result
	ORDER BY Id
END
GO