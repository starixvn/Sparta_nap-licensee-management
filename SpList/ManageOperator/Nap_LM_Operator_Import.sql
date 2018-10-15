/*<info serverAlias="DBCUST-SiteConfig" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_Operator_Import]
	@OperatorXml	VARCHAR(MAX)
AS
/*
	 Created: Amanda
	 Date: 2018-10-12
	 Task: Implement "Manage operatorID" function
	 DB: DBCUST.SiteConfig
	 
	 Revisions:
	  - 20181012@Amanda: Import operator [Redmine: #83584]
	  
	 Note:
	  @OperatorXml: xml structure. ex:
		  <ROOT>
			  <Operator ID="1" AgentId="1" UserName="12betUUS01" SiteName="12bet" OperatorId="oper" />
			  <Operator ID="2" AgentId="2" UserName="spondemoEUR01" SiteName="spondemo" OperatorId="" />
		  </ROOT>
*/
BEGIN
	SET NOCOUNT ON;
	
	CREATE TABLE #Operators (AgentId INT PRIMARY KEY, SiteName VARCHAR(50), UserName VARCHAR(30), OperatorId VARCHAR(50), CurrencyId INT, [Status] VARCHAR(10), Error VARCHAR(100), ID INT)

	BEGIN TRY
		BEGIN TRANSACTION
	
			DECLARE @DocHandler INT
			EXEC sp_xml_preparedocument @DocHandler OUTPUT
					,@OperatorXml
			INSERT INTO #Operators (ID, AgentId, UserName, SiteName, OperatorId)
			SELECT ID, AgentId, UserName, SiteName, CASE WHEN OperatorId = '' THEN NULL ELSE OperatorId END
			FROM OPENXML(@DocHandler, '/ROOT/Operator', 1) WITH (ID INT, AgentId INT, UserName VARCHAR(30), SiteName VARCHAR(50), OperatorId VARCHAR(50)) AS Data

			EXEC sp_xml_removedocument @DocHandler

			-- update operator
			UPDATE o
			SET o.[Status] = CASE 
								WHEN ISNULL(o1.OperatorId, '') <> '' OR o.UserName <> c.username OR o.SiteName <> o1.SiteName THEN 'Error'
								ELSE 'Update'
							END,
				o.Error = CASE 
								WHEN ISNULL(o1.OperatorId, '') <> '' THEN 'Operator exists'
								WHEN ISNULL(o1.OperatorId, '') = '' AND o.UserName <> c.username THEN 'Wrong user name'
								WHEN ISNULL(o1.OperatorId, '') = '' AND o.SiteName <> o1.SiteName THEN 'Wrong site name'
								ELSE NULL
							END
			FROM #Operators o
			INNER JOIN dbo.Operator o1 WITH (NOLOCK) ON o.AgentId = o1.AgentID
			INNER JOIN CustDB.dbo.Customer c WITH (NOLOCK) ON o1.AgentID = c.custid
			
			-- validate new operator with customer
			UPDATE o
			SET o.[Status] = CASE 
								WHEN c.CustId IS NULL OR o.UserName <> c.username OR o.SiteName <> c.[site] THEN 'Error'
								ELSE 'Add'
							END,
				o.Error = CASE 
								WHEN c.CustId IS NULL THEN 'Agent does not exist'
								WHEN c.CustId IS NOT NULL AND o.UserName <> c.username THEN 'Wrong user name'
								WHEN c.CustId IS NOT NULL AND o.SiteName <> c.[site] THEN 'Wrong site name'
								ELSE NULL
							END,
				o.CurrencyId = c.currency
			FROM #Operators o
			LEFT JOIN CUSTDB.dbo.Customer c WITH (NOLOCK) ON o.AgentId = c.CustId
			WHERE o.[Status] IS NULL

			INSERT INTO dbo.Operator(AgentId, Currency, SiteName, OperatorID)
			SELECT AgentId, CurrencyId, SiteName, OperatorId
			FROM #Operators
			WHERE [Status] = 'Add'
			
			UPDATE dest
			SET OperatorID = src.OperatorId
			FROM dbo.Operator dest WITH (NOLOCK)
			INNER JOIN #Operators src WITH (NOLOCK) ON dest.AgentID = src.AgentId
			WHERE src.[Status] = 'Update' AND ISNULL(dest.OperatorID, '') = ''
			
			SELECT AgentId, SiteName, UserName, OperatorId, [Status], Error FROM #Operators ORDER BY ID
			
		COMMIT
	END TRY
	
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK
	END CATCH
	
	DROP TABLE #Operators
END
GO