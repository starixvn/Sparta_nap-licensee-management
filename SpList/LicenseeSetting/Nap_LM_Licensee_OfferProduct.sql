/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_OfferProduct]
	@LicenseeName	VARCHAR(50),
	@ProductCode	VARCHAR(100)='',
	@EffectiveDate	DATE =''
AS
/*
	 Created: Amanda
	 Date: 2018-11-12
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181112@Amanda: Offer Product from Licensee [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;

	DECLARE @LicenseeID INT, @ResellerID INT 
	DECLARE @ProductPrefix AS TABLE(Id INT IDENTITY(1,1), ProductCode VARCHAR(10))
	
	SELECT @LicenseeID = LicenseeID
	FROM dbo.Licensees WITH (NOLOCK)
	WHERE LicenseeName = @LicenseeName

	SELECT @ResellerID = ResellerID
	FROM dbo.LicenseeReseller WITH (NOLOCK)
	WHERE LicenseeID = @LicenseeID AND ResellerID <> 3
	
	IF ISNULL(@LicenseeID, 0) = 0 OR ISNULL(@ResellerID, 0) = 0
	BEGIN
		SELECT 'Invalid licensee name'
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
		SELECT 'Invalid product'
		RETURN
	END
	
	EXEC [dbo].[DBA_Lrf_OfferProduct]
	@ResellerID		= @ResellerID,
	@LicenseeId  	= @LicenseeID,
	@ProductCode  	= @ProductCode,
	@EffectiveDate	= @EffectiveDate,
	@IsPullService	= 1
END
GO