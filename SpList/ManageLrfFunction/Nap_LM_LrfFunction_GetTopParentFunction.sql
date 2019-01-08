/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LrfFunction_GetTopParentFunction]
AS
/*
	 Created: Amanda
	 Date: 2019-01-04
	 Task: Implement "Manage LRF Function" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20190104@Amanda: Get Top Parent LRF function [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT FunctionId AS Id, Name AS Name
	FROM dbo.Functions WITH (NOLOCK)
	WHERE ParentId = 0
	ORDER BY DisplayOrder
END
GO