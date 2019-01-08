/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LrfFunction_Select]
	@ParentFunctionId	INT
	, @Type				INT
	, @Environment		VARCHAR(10)
AS
/*
	 Created: Amanda
	 Date: 2019-01-04
	 Task: Implement "Manage LRF Function" function
	 DB: DBCUST.bodb_licensee
	 
	 Developer's Note:
		- Type: 0 -- All
				1 -- Menu
				2 -- Function
	 
	 Revisions:
	  - 20190104@Amanda: Get LRF function [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	;WITH Parent_CTE as (
		SELECT	FunctionId,
				Name,
				ParentId,
				Url,
				IsMenu,
				IsActive,
				DisplayOrder,
				IsNew,
				FunctionKey,
				Environment,
				IsFunction
		FROM dbo.Functions WITH (NOLOCK)
		WHERE ((@ParentFunctionId = 0 AND ParentId = 0) OR FunctionId = @ParentFunctionId)
			AND (@Type = 0 OR (@Type = 1 AND IsMenu = 1) OR (@Type = 2 AND IsFunction = 1))
			AND (ISNULL(@Environment,'') = '' OR Environment = @Environment)
		UNION ALL 
		SELECT	f.FunctionId,
				f.Name,
				f.ParentId,
				f.Url,
				f.IsMenu,
				f.IsActive,
				f.DisplayOrder,
				f.IsNew,
				f.FunctionKey,
				f.Environment,
				f.IsFunction
		FROM Functions f WITH (NOLOCK)
		INNER JOIN Parent_CTE p on f.ParentId = p.FunctionId
		WHERE (@Type = 0 OR (@Type = 1 AND f.IsMenu = 1) OR (@Type = 2 AND f.IsFunction = 1))
			AND (ISNULL(@Environment,'') = '' OR f.Environment = @Environment)
	)
	SELECT FunctionId,
			Name,
			ParentId,
			Url,
			IsMenu,
			IsActive,
			DisplayOrder,
			IsNew,
			FunctionKey,
			Environment,
			IsFunction
	FROM Parent_CTE
	ORDER BY ParentId, DisplayOrder
	OPTION (maxrecursion 20)
END
GO