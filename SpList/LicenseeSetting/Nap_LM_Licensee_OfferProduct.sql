/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_OfferProduct]
	@LicenseeName	INT,
	@ProductCode	VARCHAR(100)='',
	@EffectiveDate	SMALLDATETIME ='',
	@IsPullService  BIT  = 1 
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Remove Product from Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @LicenseeID INT, @ResellerID INT 
	DECLARE @ProductPrefix AS TABLE(Id INT IDENTITY(1,1), ProductCode VARCHAR(100))
	
	SELECT @LicenseeID = LicenseeID
	FROM dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	SELECT @ResellerID = ResellerID
	FROM dbo.LicenseeReseller WITH (NOLOCK)
	WHERE LicenseeID = @LicenseeID AND ResellerID <> 3
	
	IF ISNULL(@LicenseeID, 0) = 0 OR ISNULL(@ResellerID, 0) = 0
	BEGIN
		RAISERROR ('Invalid licensee name', 16, 1)
		RETURN
	END
	
	INSERT INTO @ProductPrefix (ProductCode)  
	SELECT val 
	FROM CUSTDB.dbo.strSplit(@ProductCode,',')
	
	IF EXISTS (
		SELECT 1
		FROM @ProductPrefix pp
		LEFT JOIN dbo.Product3rd p WITH (NOLOCK) ON pp.ProductCode = p.ProductPrefix
		WHERE pp.ProductCode <> 'SB' AND p.Productid IS NULL)
	BEGIN
		RAISERROR ('Invalid product', 16, 1)
		RETURN
	END
	
	BEGIN TRY
	BEGIN TRANSACTION OfferProduct
		
		EXEC [dbo].[DBA_Lrf_OfferProduct]
		@ResellerID		= @ResellerID,
		@LicenseeId  	= @LicenseeID,
		@ProductCode  	= @ProductCode,
		@EffectiveDate	= @EffectiveDate,
		@IsPullService	= @IsPullService

	COMMIT TRANSACTION OfferProduct

	END TRY
	 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION OfferProduct
			
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
END
GO