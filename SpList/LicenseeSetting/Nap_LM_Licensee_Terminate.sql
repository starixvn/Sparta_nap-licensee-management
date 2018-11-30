/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_Terminate]
	@LicenseeName VARCHAR(50)
AS
/*
	 Created: Amanda
	 Date: 2018-11-21
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181121@Amanda: Terminate Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @LicenseeId INT
	
	SELECT @LicenseeId = LicenseeID
	FROM dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	IF ISNULL(@LicenseeId, 0) = 0
	BEGIN
		RAISERROR ('Invalid licensee name', 16, 1)
		RETURN
	END
	
	IF EXISTS (SELECT 1 FROM dbo.Licensees WITH (NOLOCK) WHERE LicenseeID = @LicenseeId AND isActive = 0 )
		AND NOT EXISTS (SELECT 1 FROM dbo.SystemLicensee WITH (NOLOCK) WHERE LicenseeID = @LicenseeId AND IsActive = 1)
	BEGIN
		SELECT 0
		RETURN
	END
	
	DECLARE @XACT_ABORT VARCHAR(3) = 'OFF';  
	IF ( (16384 & @@OPTIONS) = 16384 ) SET @XACT_ABORT = 'ON';  
	
	IF @XACT_ABORT = 'OFF'
	BEGIN
		SET XACT_ABORT ON
	END

	BEGIN TRY
	BEGIN TRANSACTION TerminateLicensee
		UPDATE dbo.Licensees WITH (ROWLOCK, UPDLOCK)
		SET IsActive = 0
		WHERE LicenseeID = @LicenseeId
	
		DECLARE @SystemNames VARCHAR(100)

		SELECT @SystemNames = STUFF((
								SELECT ',' + s.SystemName
								FROM dbo.SystemLicensee sl WITH (NOLOCK)
								INNER JOIN dbo.Systems s WITH (NOLOCK) ON sl.SystemID = s.id
								WHERE sl.LicenseeID = @LicenseeId AND sl.IsActive = 1
							FOR XML PATH('')), 1, 1, '')  

		EXEC [dbo].[DBA_Lrf_ActiveLicenseeSystem] @LicenseeName = @LicenseeName, @SystemDeactivate = @SystemNames]]

		COMMIT TRANSACTION TerminateLicensee
	
		SELECT 1
	END TRY
 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION TerminateLicensee
			
		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;

		SELECT
			@ErrorMessage = ERROR_MESSAGE(),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

			RAISERROR (@ErrorMessage, -- Message text.
					   @ErrorSeverity, -- Severity.
					   @ErrorState -- State.
					   );
	END CATCH
	
	IF @XACT_ABORT = 'OFF'
	BEGIN
		SET XACT_ABORT OFF
	END
END
GO