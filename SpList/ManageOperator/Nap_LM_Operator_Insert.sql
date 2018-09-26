/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Operator_Insert]
	@SiteName			VARCHAR(50),
	@CurrencyId			INT,
	@OperatorId			VARCHAR(50) = NULL,
	@AgentId			INT
AS
/*
	 Created: Amanda
	 Date: 2018-09-25
	 Task: Implement "Manage operatorID" function
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20180925@Amanda: Add new operator [Redmine: #83584]
	  
	 Example:
	  exec Nap_LM_Operator_Select
*/
BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO dbo.Operator(AgentID, SiteName, Currency, OperatorID)
	VALUES (@AgentId, @SiteName, @CurrencyId, @OperatorId)
END
GO