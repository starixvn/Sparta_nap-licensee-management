namespace Fanex.NAP.Licensee.Controllers.Attributes
{
    using System;
    using System.Web;
    using System.Web.Mvc;

    [AttributeUsage(AttributeTargets.Class)]
    public sealed class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            if (IsInvalidFilter(filterContext))
            {
                return;
            }
            
            if (filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                AssignResultAjaxRequest(filterContext);
            }
            else
            {
                AssignResultNormalRequest(filterContext);
            }

            Logging.LogService.Error(filterContext.Exception.Message, filterContext.Exception);
            UpdateFilterContext(filterContext);
        }

        private bool IsInvalidFilter(ExceptionContext filterContext)
        {
            return filterContext.ExceptionHandled
                || !filterContext.HttpContext.IsCustomErrorEnabled
                || new HttpException(null, filterContext.Exception).GetHttpCode() != 500
                || !ExceptionType.IsInstanceOfType(filterContext.Exception);
        }

        private void AssignResultAjaxRequest(ExceptionContext filterContext)
        {
            filterContext.Result = new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    error = true,
                    message = filterContext.Exception.Message
                }
            };
        }

        private void AssignResultNormalRequest(ExceptionContext filterContext)
        {
            var controllerName = (string)filterContext.RouteData.Values["controller"];
            var actionName = (string)filterContext.RouteData.Values["action"];
            var model = new HandleErrorInfo(filterContext.Exception, controllerName, actionName);

            filterContext.Result = new ViewResult
            {
                ViewName = View,
                MasterName = Master,
                ViewData = new ViewDataDictionary(model),
                TempData = filterContext.Controller.TempData
            };
        }

        private void UpdateFilterContext(ExceptionContext filterContext)
        {
            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();
            filterContext.HttpContext.Response.StatusCode = 500;

            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
        }
    }
}