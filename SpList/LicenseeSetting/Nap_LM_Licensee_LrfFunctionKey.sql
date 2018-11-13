/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Licensee_LrfFunctionKey]
	@ProductCode VARCHAR(100) = ''
AS
/*
	 Created: Amanda
	 Date: 2018-11-13
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181113@Amanda: Get lrf function keys by product code [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @tblFunctions AS TABLE (ProductId INT,FunctionId INT,TypeID INT)
	
	INSERT INTO @tblFunctions
	EXEC DBA_Lrf_FunctionProduct @ProductCode = @ProductCode
	
	SELECT af.FunctionKey
	FROM dbo.Functions af WITH (NOLOCK)
	INNER JOIN @tblFunctions f ON af.FunctionId = f.FunctionId
	WHERE f.TypeID = 1 -- LRF
END
GO