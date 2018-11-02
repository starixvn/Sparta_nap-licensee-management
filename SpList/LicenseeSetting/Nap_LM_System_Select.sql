/*<info serverAlias="DBCUST-bodb_licensee" executers="bodbLicenseeNet" viewers="vnteam" isFunction="0" isNested="0"></info>*/

CREATE PROCEDURE [dbo].[Nap_LM_System_Select]
AS
/*
	 Created: Amanda
	 Date: 2018-11-01
	 Task: Implement "Licensee Setting" function
	 DB: DBCUST.bodb_licensee
	 
	 Revisions:
	  - 20181101@Amanda: Select System [Redmine: #83584]
*/
BEGIN
	SET NOCOUNT ON;
	
	SELECT s.SystemName, s.[Description]
	FROM dbo.Systems s
END
GO