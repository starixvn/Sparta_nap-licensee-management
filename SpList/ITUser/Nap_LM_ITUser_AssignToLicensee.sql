/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_AssignToLicensee]
	@UserId	INT,
	@AssignedLicensees VARCHAR(MAX) = '',
	@UnassignedLicensees VARCHAR(MAX) = '',
	@AssignOption INT = 0,
	@RemoveOption INT = 0
AS
/*
	 Created: Amanda
	 Date: 2019-01-24
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190124@Amanda: Add/Remove Licensee for User [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @Result AS TABLE ([Message] VARCHAR(MAX), IsOk BIT, Id INT)
	DECLARE @Status VARCHAR(30)
	DECLARE @Date DATETIME
	
	SET @Date = GETDATE()
	SELECT @Status = [Status] FROM dbo.Users WITH (NOLOCK) WHERE UserID = @UserId	
	
	IF @Status IS NULL
	BEGIN
		INSERT INTO @Result([Message], IsOk, Id)
		VALUES('User does not exist.', 0, 1)
	END
	ELSE IF @Status <> 'Open'
	BEGIN
		INSERT INTO @Result([Message], IsOk, Id)
		VALUES('User is not active.', 0, 2)
	END
	ELSE
	BEGIN	
		CREATE TABLE #AssignedLicensee (Id INT, Name VARCHAR(50), IsActive BIT, IsAssigned BIT, IsActiveUser BIT)
		
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
			SET a.IsAssigned = 1, a.IsActiveUser = l.isActive
			FROM #AssignedLicensee a
			INNER JOIN dbo.LicenseeUser l WITH (NOLOCK) ON a.Id = l.LicenseeId
			WHERE a.Id IS NOT NULL AND a.IsActive = 1 AND l.UserID = @UserId
			
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
				SELECT '- Licensees have been added this user before.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE IsAssigned = 1 AND IsActiveUser = 1
				FOR XML PATH('')), 1, 2, '') + ')', 1, 6
			END
			
			IF EXISTS (SELECT 1 FROM @Result WHERE Id BETWEEN 4 AND 6)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				VALUES ('The following licensees were not added for this user:', 1, 3)
			END
			
			DELETE #AssignedLicensee WHERE Id IS NULL OR IsActive = 0 OR (IsAssigned = 1 AND IsActiveUser = 1)
			
			-- Update licensee users that were closed
			UPDATE lu
			SET lu.isActive = 1, ModifyBy = NULL, ModifyDate = @Date
			FROM dbo.LicenseeUser lu WITH (ROWLOCK, UPDLOCK)
			INNER JOIN #AssignedLicensee a ON lu.LicenseeID = a.Id
			WHERE lu.UserID = @UserId AND a.IsAssigned = 1 AND a.IsActiveUser = 0
			
			
			-- Add new licensee user
			INSERT INTO dbo.LicenseeUser (LicenseeId, UserID, isActive, ModifyDate)
			SELECT Id, @UserId, 1, @Date
			FROM #AssignedLicensee
			WHERE IsAssigned = 0
			
			-- Add function for licensee user
			IF (@AssignOption = 1)
			BEGIN
				INSERT INTO dbo.LicenseeUserFunctions (FunctionId, LicenseeId, UserId)
				SELECT f.FunctionId, l.Id, @UserId
				FROM #AssignedLicensee l
				INNER JOIN dbo.LicenseeFunctions lf WITH (NOLOCK) ON l.Id = lf.LicenseeId
				INNER JOIN dbo.Functions f WITH (NOLOCK) ON lf.FunctionId = f.FunctionId
				WHERE f.IsActive = 1
					AND f.FunctionId NOT IN (6, 74)
					AND f.ParentId NOT IN (6, 74)
					AND NOT EXISTS (
						SELECT 1 
						FROM dbo.LicenseeUserFunctions luf WITH (NOLOCK) 
						WHERE luf.LicenseeId = l.Id AND luf.UserId = @UserId AND luf.FunctionId = f.FunctionId)
			END
			ELSE IF (@AssignOption = 2)
			BEGIN
				INSERT INTO dbo.LicenseeUserFunctions (FunctionId, LicenseeId, UserId)
				SELECT f.FunctionId, l.Id, @UserId
				FROM #AssignedLicensee l
				INNER JOIN dbo.LicenseeFunctions lf WITH (NOLOCK) ON l.Id = lf.LicenseeId
				INNER JOIN dbo.Functions f WITH (NOLOCK) ON lf.FunctionId = f.FunctionId
				WHERE f.IsActive = 1
					AND NOT EXISTS (
						SELECT 1 
						FROM dbo.LicenseeUserFunctions luf WITH (NOLOCK) 
						WHERE luf.LicenseeId = l.Id AND luf.UserId = @UserId AND luf.FunctionId = f.FunctionId)
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
			INNER JOIN dbo.LicenseeUser l WITH (NOLOCK) ON a.Id = l.LicenseeId
			WHERE a.Id IS NOT NULL AND a.IsActive = 1 AND l.UserID = @UserId
			
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
				SELECT '- This user is not in licensee user list.(' + STUFF((
								SELECT ', ' + Name
								FROM #AssignedLicensee
								WHERE Id IS NOT NULL AND IsActive = 1 AND IsAssigned IS NULL
				FOR XML PATH('')), 1, 2, '') + ')', 1, 10
			END

			IF EXISTS (SELECT 1 FROM @Result WHERE Id BETWEEN 8 AND 10)
			BEGIN
				INSERT INTO @Result([Message], IsOk, Id)
				VALUES ('The following licensees were not removed from this user:', 1, 7)
			END
			
			DELETE #AssignedLicensee WHERE IsAssigned IS NULL
			
			-- Remove function from licensee
			UPDATE l
			SET l.isActive = 0, ModifyBy = NULL, ModifyDate = @Date
			FROM dbo.LicenseeUser l WITH (ROWLOCK, UPDLOCK)
			INNER JOIN #AssignedLicensee a ON l.LicenseeId = a.Id
			WHERE l.UserID = @UserId
			
			-- Remove function from licensee user
			IF (@RemoveOption = 1)
			BEGIN
				DELETE u
				FROM dbo.LicenseeUserFunctions u WITH (ROWLOCK)
				INNER JOIN #AssignedLicensee a ON u.LicenseeId = a.Id
				WHERE u.UserId = @UserId
			END
		END
		
		DROP TABLE #AssignedLicensee
	END

	SELECT [Message], IsOk
	FROM @Result
	ORDER BY Id
END
GO