/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_SourceLicensee_GetSourceData]
	@FromDate			DATE		= '',
	@ToDate				DATE		= '',
	@LicenseeId			INT			= 0,
	@SourceLicenseeId	INT			= 0,
	@CurrencyId			INT			= 0,
	@RoleId				INT			= 0,
	@PageIndex			INT			= 1,
	@PageSize			INT			= 20,
	@TotalItem			INT			= 0 OUTPUT
AS
/*
	 Created: Amanda
	 Date: 2018-12-11
	 Task: Implement "Source Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181211@Amanda: Select Source Licensees [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	CREATE TABLE #data (
		RowNum		INT,
		SourceId	INT,
		CurrencyId	INT
	)
	DECLARE @from INT, @to INT
	
	IF @RoleId = 2 -- Agent
	BEGIN
		INSERT INTO #data (RowNum, SourceId, CurrencyId)
		SELECT	ROW_NUMBER() OVER (ORDER BY l.Currency ASC),
				l.CustID,
				l.Currency
		FROM dbo.LicenseeCust l WITH (NOLOCK)
		WHERE l.LicenseeID = @SourceLicenseeId AND l.Currency = @CurrencyId AND l.RoleID = 2
	END
	IF @RoleId = 1 -- Member
	BEGIN
		INSERT INTO #data (RowNum, SourceId, CurrencyId)
		SELECT	ROW_NUMBER() OVER (ORDER BY l.Currency ASC),
				c.custid,
				c.currency
		FROM CustDB.dbo.custInfo c WITH (NOLOCK)
		INNER JOIN dbo.LicenseeCust l WITH (NOLOCK) ON l.CustID = c.recommend
		WHERE l.LicenseeID = @SourceLicenseeId AND l.RoleID = 2 AND l.currency = @CurrencyId AND c.roleid = 1 AND c.currency = @CurrencyId
	END

	SELECT @TotalItem = MAX(RowNum)
	FROM #data
	
	SET @from = ((@PageIndex - 1) * @PageSize) + 1
	SET @to = @from + @PageSize - 1
	
	;WITH Setting_CTE AS (
		SELECT l.SourcedId, l.EffectiveDate, l.EndDate 
		FROM dbo.LicenseeSourcedSetting l WITH(NOLOCK)
		WHERE l.LicenseeID = @LicenseeId
			AND l.SourcedLicenseeID = @SourceLicenseeId
			AND l.Roleid = @Roleid
			AND l.SourcedCurrencyID = @CurrencyId
			AND @FromDate <= l.EndDate
			AND @ToDate >= l.EffectiveDate
	)
	SELECT	d.SourceId,
			d.CurrencyId	AS CurrencyID,
			e.currency		AS CurrencyName,
			@RoleId			AS RoleId,
			s.EffectiveDate,
			s.EndDate,
			CASE WHEN s.SourcedId IS NOT NULL THEN 0 ELSE 1 END AS IsActive		
	FROM #data d
	INNER JOIN CustDB.dbo.Exchange e WITH (NOLOCK) ON e.exchangeid = d.CurrencyId
	LEFT JOIN Setting_CTE s ON s.SourcedId = d.SourceId
	WHERE d.RowNum BETWEEN @from AND @to
	
	DROP TABLE #data
	
END
GO
