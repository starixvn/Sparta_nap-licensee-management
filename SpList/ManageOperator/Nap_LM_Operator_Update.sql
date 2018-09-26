/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Operator_Update]
	@AgentId			INT,
	@OperatorId			VARCHAR(50)
AS
/*
	 Created: Amanda
	 Date: 2018-09-25
	 Task: Implement "Manage operatorID" function
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20180925@Amanda: Update operator [Redmine: #83584]
	  
	 Example:
	  exec Nap_LM_Operator_Select
*/
BEGIN
	SET NOCOUNT ON;
	
	UPDATE dbo.Operator WITH(ROWLOCK, UPDLOCK)
	SET OperatorID = @OperatorId
	WHERE AgentID = @AgentId
END
GO