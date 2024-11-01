<%@ Page Language="C#" EnableSessionState="False" %>
<%@ Import Namespace="Fanex.NAP.Licensee.Service.Helpers" %>

<html>
<head runat="server">
    <title>Who Am I?</title>
</head>
<body>
<div>
    Web Name: <%= Request.ServerVariables["Server_Name"] %>
</div>
<div>
    Port: <%= Request.Url.Port %>
</div>
<div>
    Server IP: <%= Request.ServerVariables["LOCAL_ADDR"]%>
</div>
<div>
    Server Time: <%= DateTimeOffset.Now%>
</div>
<div>
    Client IP: <%= HttpRequestHelper.GetClientIp(Request)%>
</div>
<div>
    Client IP (UserHostAddress): <%= Request.UserHostAddress%>
</div>
<div>
    Client IP (XFF): <%= Request.ServerVariables["HTTP_X_FORWARDED_FOR"]%>
</div>
<div>
    Actual Client IP: <%= Request.ServerVariables["HTTP_X_ACTUAL_IP"]%>
</div> 
<div>
    HTTP_VIA: <%= Request.ServerVariables["HTTP_VIA"]%>
</div>
<div>
    HTTP_PROXY_CONNECTION: <%= Request.ServerVariables["HTTP_PROXY_CONNECTION"]%>
</div>
</body>
</html>