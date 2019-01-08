/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_LrfFunction_Select]
	@ParentFunctionId	INT
	, @IsFunction		INT
	, @IsMenu			INT
	, @Environment		VARCHAR(10)
AS
/*
	 Created: Amanda
	 Date: 2019-01-04
	 Task: Implement "Manage LRF Function" function
	 DB: DBCUST.bodb_licensee
	 
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
		WHERE FunctionId = @ParentFunctionId AND IsFunction = @IsFunction AND IsMenu = @IsMenu AND (ISNULL(@Environment,'') = '' OR Environment = @Environment)
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
		WHERE f.IsFunction = @IsFunction AND f.IsMenu = @IsMenu AND (ISNULL(@Environment,'') = '' OR f.Environment = @Environment)
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