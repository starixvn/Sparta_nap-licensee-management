// -----------------------------------------------------------------------
// <copyright file="AjaxRequestAttribute.cs" company="Nexcel">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------
namespace Fanex.NAP.Licensee.Controllers.Attributes
{
    using System;
    using System.Reflection;
    using System.Web.Mvc;

    /// <summary>
    ///  Ajax request attribute class.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class AjaxRequestAttribute : ActionMethodSelectorAttribute
    {
        public override bool IsValidForRequest(ControllerContext controllerContext, MethodInfo methodInfo)
        {
            return controllerContext.HttpContext.Request.IsAjaxRequest();
        }
    }
}