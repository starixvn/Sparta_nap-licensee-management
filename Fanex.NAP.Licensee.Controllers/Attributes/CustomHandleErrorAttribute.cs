// -----------------------------------------------------------------------
// <copyright file="CustomHandleErrorAttribute.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers.Attributes
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        /// <summary>
        /// Handle exceptions.
        /// </summary>
        /// <param name="filterContext">The exception context.</param>
        [SuppressMessage(
                  "StyleCop.CSharp.Nexcel.NexcelCustomRules",
                  "SP2101:MethodMustNotContainMoreLinesThan",
                  Justification = "Reviewed. Suppression is OK here.")]
        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled || !filterContext.HttpContext.IsCustomErrorEnabled)
            {
                return;
            }

            if (new HttpException(null, filterContext.Exception).GetHttpCode() != 500)
            {
                return;
            }

            if (!ExceptionType.IsInstanceOfType(filterContext.Exception))
            {
                return;
            }

            // if the request is AJAX return JSON else view.
            if (filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
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
            else
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

            // log the error by using your own method
            Logging.LogService.Error(filterContext.Exception.Message, filterContext.Exception);
            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();
            filterContext.HttpContext.Response.StatusCode = 500;

            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
        }
    }
}