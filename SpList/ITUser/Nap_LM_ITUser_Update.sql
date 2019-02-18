/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_ITUser_Update]
	@UserId INT,
	@FirstName NVARCHAR(50),
	@LastName NVARCHAR(50),
	@IsActive BIT
AS
/*
	 Created: Amanda
	 Date: 2019-02-15
	 Task: Implement "IT User Management" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190215@Amanda: Update IT User [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	IF NOT EXISTS (SELECT 1 FROM dbo.Users WITH (NOLOCK) WHERE UserID = @UserId AND isInternal = 0)
	BEGIN
		SELECT 'User does not exist!' AS [Message]
		RETURN
	END
	
	UPDATE dbo.Users WITH (ROWLOCK, UPDLOCK)
	SET FirstName = @FirstName,
		LastName = @LastName,
		[Status] = CASE WHEN @IsActive = 1 THEN 'Open' ELSE 'Close' END
	WHERE UserID = @UserId
	
	SELECT TOP(0) '' AS [Message], CAST(1 AS BIT) AS IsOk
END
GO