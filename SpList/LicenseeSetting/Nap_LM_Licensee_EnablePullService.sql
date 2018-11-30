/*<info serverAlias="DBPTCS-bodb_PlaytechCS" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_EnablePullService]
	@LicenseeName		VARCHAR(50),
	@SettingName		varchar(50)
AS
/*
	 Created: Amanda
	 Date: 2018-11-22
	 Task: Implement "Licensee Setting" function
	 DB: DBPTCS.bodb_PlaytechCS
	 
	 Revisions:
	  - 20181122@Amanda: Add licensee into pull service [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @LicenseeID INT = NULL
	SELECT @LicenseeID = LicenseeID FROM bodb_licensee.dbo.Licensees WITH (NOLOCK) WHERE LicenseeName = @LicenseeName

	IF ISNULL(@LicenseeID, 0) = 0
	BEGIN
		RAISERROR ('Invalid licensee name', 16, 1)
		RETURN
	END
	
	EXEC [dbo].[DBA_Lrf_PullServiceSetting]
		@LicenseeId		= @LicenseeID,
		@LicenseeName	= @LicenseeName,
		@SettingName	= @SettingName
END
GO