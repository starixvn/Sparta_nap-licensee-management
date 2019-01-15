/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_ActivateSystem]
	@LicenseeName	VARCHAR(50),
	@SystemName		VARCHAR(100)
AS
/*
	 Created: Amanda
	 Date: 2019-01-15
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190115@Amanda: Activate Systems for Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	IF NOT EXISTS (SELECT 1 FROM dbo.Licensees WITH (NOLOCK) WHERE LicenseeName = @LicenseeName)
	BEGIN
		SELECT 'Invalid licensee name!'
		RETURN
	END

	IF ISNULL(@SystemName,'') <> ''
	BEGIN
		BEGIN TRY
			EXEC [dbo].[DBA_Lrf_ActiveLicenseeSystem] @LicenseeName = @LicenseeName, @SystemisActive = @SystemName
		END TRY
		BEGIN CATCH
			SELECT ERROR_MESSAGE()
			RETURN
		END CATCH
	END
	
	SELECT NULL
END
GO