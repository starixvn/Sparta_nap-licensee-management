using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.NAP.Core.Configuration;
using Fanex.NAP.Core.Web.Session;
using Fanex.NAP.Core.Service.Interface;
using Fanex.NAP.Core.Web.Context;
using Fanex.NAP.Core.Service.Impl;

namespace Fanex.NAP.Licensee.Controllers
{
    public class BaseController : Controller
    {
        private readonly string _environment = NapSettings.Settings.Environment;
        private readonly int _siteId = NapSettings.Settings.SiteId;
        private readonly bool _isSiteLogin = NapSettings.Settings.EnableDirectLogin;

        public BaseController()
        {
            CurrentContext = new CurrentContext();
            ViewBag.Session = CurrentSession = new CurrentSession();
            ServiceContext = new ServiceContext
            {
                UserId = CurrentSession.UserId,
                Ip = CurrentContext.IP
            };
        }

        public int SiteId
        {
            get { return _siteId; }
        }

        public bool IsSiteLogin
        {
            get { return _isSiteLogin; }
        }

        public string Environment
        {
            get { return _environment; }
        }


        public IServiceContext ServiceContext
        {
            get;
            set;
        }

        public ICurrentContext CurrentContext
        {
            get;
            set;
        }

        public ICurrentSession CurrentSession
        {
            get;
            set;
        }
    }
}
