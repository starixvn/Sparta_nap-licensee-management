/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LicenseeProduct_Select]
	@LicenseeList		VARCHAR(MAX)= '',
	@ProductList		VARCHAR(MAX)= '',
	@PageIndex			INT			= 1,
	@PageSize			INT			= 20,
	@TotalItem			INT			= 0 OUTPUT

AS
/*
	 Created: Amanda
	 Date: 2018-12-21
	 Task: Implement "Manage Product" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181221@Amanda: Select licensee product [Redmine: #83584]
	  
	 Developer's note:
	  - @LicenseeList = '' : get all
	  - @ProductList = '' : get all
*/
BEGIN
	SET NOCOUNT ON;

	CREATE TABLE #Product (Id INT, ProductCode VARCHAR(10))
	CREATE TABLE #Licensee (RowId INT IDENTITY(1,1), Id INT, LicenseeName VARCHAR(50))
	DECLARE @sql VARCHAR(MAX)
	DECLARE @from INT, @to INT

	IF ISNULL(@ProductList, '') <> ''
	BEGIN
		INSERT INTO #Product(ProductCode)
		SELECT val
		FROM CUSTDB.dbo.strSplit(@ProductList,',')

		UPDATE #Product
		SET Id = 0
		WHERE ProductCode = 'SB'

		UPDATE p
		SET p.Id = p3.Productid
		FROM #Product p
		INNER JOIN dbo.Product3rd p3 WITH (NOLOCK) ON p.ProductCode = p3.ProductPrefix
		
		DELETE #Product
		WHERE Id IS NULL
	END
	ELSE
	BEGIN
		INSERT INTO #Product(Id, ProductCode)
		VALUES (0, 'SB')
		
		INSERT INTO #Product(Id, ProductCode)
		SELECT Productid, ProductPrefix
		FROM dbo.Product3rd p WITH (NOLOCK)
	END

	SELECT @ProductList = STUFF((
						SELECT ',[' + ProductCode + ']'
						FROM #Product
						FOR XML PATH('')), 1, 1, '')

	IF ISNULL(@LicenseeList, '') <> ''
	BEGIN
		INSERT INTO #Licensee(Id, LicenseeName)
		SELECT l.LicenseeID, l.LicenseeName
		FROM CUSTDB.dbo.strSplit(@LicenseeList,',') s
		INNER JOIN dbo.Licensees l WITH (NOLOCK) ON s.val = l.LicenseeID
	END
	ELSE
	BEGIN
		INSERT INTO #Licensee(Id, LicenseeName)
		SELECT LicenseeID, LicenseeName
		FROM dbo.Licensees l WITH (NOLOCK)
	END

	SET @from = ((@PageIndex - 1) * @PageSize) + 1
	SET @to = @from + @PageSize - 1
	
	SET @sql = 'SELECT LicenseeId, LicenseeName, ' + @ProductList
			   + ' FROM ('
			   + ' SELECT l.Id AS LicenseeId, l.LicenseeName, p.ProductCode, p.Id AS ProductId, l.RowId'
			   + ' FROM dbo.LicenseeProduct3rd lp WITH (NOLOCK)'
			   + ' INNER JOIN #Product p ON lp.ProductID = p.Id'
			   + ' RIGHT JOIN #Licensee l ON lp.LicenseeID = l.Id'
			   + ' WHERE l.RowId BETWEEN '+ CAST(@from AS VARCHAR(3)) + ' AND ' + CAST(@to AS VARCHAR(3))
			   + ' ) AS s'
			   + ' PIVOT('
			   + ' SUM(ProductId)'
			   + ' FOR ProductCode IN (' + @ProductList + ')'
			   + ' ) AS p'
			   + ' ORDER BY RowId'
	
	print @sql
	EXEC (@sql)

	SELECT @TotalItem = COUNT(1)
	FROM #Licensee

	DROP TABLE #Product
	DROP TABLE #Licensee
END
GO