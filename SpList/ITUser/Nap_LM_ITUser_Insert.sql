/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_Insert]
	@UserName VARCHAR(50),
	@FirstName VARCHAR(50) = '',
	@LastName VARCHAR(50) = '',
	@Email VARCHAR(50) = '',
	@IsAdmin BIT = 0,
	@LicenseeName VARCHAR(50) = '',
	@IsOpen BIT = 1,
	@UserSalt VARCHAR(50),
	@UserPwd VARCHAR(50),
	@SystemId INT = 1, -- LRF
	@Option INT = 0,
	@UserId INT = 0 OUTPUT
AS
/*
	 Created: Amanda
	 Date: 2019-01-31
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee

	 Revisions:
	  - 20190131@Amanda: Add New User [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @UserRole VARCHAR(50)
	
	IF @IsAdmin = 1
	BEGIN
		SET @UserRole = 'Admin'
	END
	ELSE
	BEGIN
		SET @UserRole = 'Licensee'
	END

	IF (@UserRole = 'Admin' AND EXISTS (SELECT TOP(1) 1 FROM dbo.Users WITH (NOLOCK) WHERE Username = @UserName)) OR
		(@UserRole = 'Licensee' AND EXISTS (SELECT 1 FROM dbo.Users WITH (NOLOCK) WHERE Username = @UserName AND UserRole = 'Admin'))
	BEGIN
		SELECT 'This user name already exists!' AS [Message], 0 AS IsOk	
		RETURN
	END	
	
	DECLARE @LicenseeId INT, @tmpLicenseeName VARCHAR(50)
	
	IF ISNULL(@LicenseeName, '') <> '' AND @LicenseeName <> 'All'
	BEGIN
		SELECT @LicenseeId = l.LicenseeId
		FROM dbo.Licensees l WITH (NOLOCK)
		INNER JOIN dbo.SystemLicensee sl WITH (NOLOCK) ON l.LicenseeID = sl.LicenseeID
		INNER JOIN dbo.LicenseeReseller lr WITH (NOLOCK) ON l.LicenseeId = lr.LicenseeId
		INNER JOIN dbo.Resellers r WITH (NOLOCK) ON lr.ResellerID = r.ResellerID
		WHERE l.LicenseeName = @LicenseeName 
			AND l.IsActive = 1
			AND sl.IsActive = 1
			AND sl.SystemID = @SystemId
			AND lr.ResellerID <> 3
			
		IF @LicenseeId IS NULL
		BEGIN
			SELECT 'Licensee does not exist or is not active or is not active for LRF system!' AS [Message], 0 AS IsOk		
			RETURN
		END
		
		SET @tmpLicenseeName = @LicenseeName
	END
	
	IF  @UserRole = 'Licensee'
	BEGIN
		IF EXISTS (SELECT TOP(1) 1 
					FROM dbo.Users u WITH (NOLOCK)
					INNER JOIN dbo.LicenseeUser lu WITH (NOLOCK) ON u.UserID = lu.UserID
					WHERE u.Username = @UserName AND u.UserRole = 'Licensee' AND u.isInternal = 0 AND lu.LicenseeID = @LicenseeId AND lu.isActive = 1)
		BEGIN
			SELECT 'This user name already exists for licensee "' + @tmpLicenseeName + '"!' AS [Message], 0 AS IsOk		
			RETURN
		END
		
		IF @LicenseeName = 'All'
		BEGIN
			SELECT 'Can not add multiple Licensees for a Licensee user!' AS [Message], 0 AS IsOk		
			RETURN
		END
	END
	
	DECLARE @Status VARCHAR(30)
	
	IF @IsOpen = 1
	BEGIN
		SET @Status = 'Open'
	END
	ELSE
	BEGIN
		SET @Status = 'Closed'
	END
	
	INSERT INTO dbo.Users (Username, UserPwd, UserSalt, UserRole, FirstName, LastName, Email, [Status], LicenseeName, isInternal, CreateDate)
	VALUES (@Username, @UserPwd, @UserSalt, @UserRole, @FirstName, @LastName, @Email, @Status, @tmpLicenseeName, 0, GETDATE())
	SET @UserID = @@identity
	
	IF @Status = 'Closed'
	BEGIN
		SELECT 'Can not assign functions and currencies for closed user!' AS [Message], 1 AS IsOk		
		RETURN
	END

	EXEC dbo.Nap_LM_ITUser_AssignToLicensee
		@UserId = @UserID,
		@AssignedLicensees = @LicenseeName,
		@AssignOption = @Option	
END
GO