/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Operator_Select]
	@SiteName	VARCHAR(50)	= '',
	@CurrencyId	INT			= 0,
	@OperatorId	VARCHAR(50)	= '',
	@AgenId		INT			= 0
AS
/*
	 Created: Amanda
	 Date: 2018-09-24
	 Task: Implement "Manage operatorID" function
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20180924@Amanda: Select Lrf Site Name which enable subsidiary  [Redmine: #83584]
	  
	 Example:
	  exec Nap_LM_Operator_Select
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT o.AgentID, o.SiteName, o.Currency, e.currency, o.OperatorID
	  FROM dbo.Operator o WITH(NOLOCK)
	  INNER JOIN CustDB.dbo.exchange e WITH(NOLOCK) ON o.Currency = e.exchangeid
	  WHERE (@SiteName = '' OR o.SiteName = @SiteName)
			AND (@CurrencyId = 0 OR o.Currency = @CurrencyId)
			AND (@OperatorId = 0 OR o.OperatorID = @OperatorId)
			AND (@AgenId = 0 OR o.AgentID = @AgenId)
END
GO