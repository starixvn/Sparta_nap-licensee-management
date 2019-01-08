namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Core;
    using Model.Criteria.LrfFunction;
    using Model.DTO;

    public class ManageLrfFunctionService : IManageLrfFunctionService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ManageLrfFunctionService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<OptionItem> GetGroupFunctionList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_GetTopParentFunction"))
            {
                return db.Query<OptionItem>();
            }
        }

        public ResultGridData<LrfFunction> GetFunctionList(LrfFunctionCriteria criteria)
        {
            var result = new ResultGridData<LrfFunction>();

            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_Select"))
            {
                var functionList = db.Query<LrfFunction>(criteria);
                result.Data = BuildFunctionHierarchy(functionList);
                result.TotalItem = functionList.Count();
            }

            return result;
        }

        private IList<LrfFunction> BuildFunctionHierarchy(IEnumerable<LrfFunction> functionList)
        {
            var hierarchy = functionList.Where(x => x.ParentId == 0).ToList();
            foreach (var func in hierarchy)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return hierarchy;
        }

        private IList<LrfFunction> GetChildrenFunctionList(int parentId, IEnumerable<LrfFunction> functionList)
        {
            var children = functionList.Where(x => x.ParentId == parentId).ToList();

            foreach (var func in children)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return children;
        }
    }
}