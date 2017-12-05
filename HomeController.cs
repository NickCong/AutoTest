
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;

namespace AutoTestWebSite.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult StartAutoTest(string testcase)
        {
            if (!System.IO.Directory.Exists(@"c:\temp"))
            {
                System.IO.Directory.CreateDirectory(@"c:\temp");
            }
            System.IO.File.WriteAllText(@"c:\temp\testcase.json", testcase, Encoding.UTF8);
            Process p = new Process();
            p.StartInfo.FileName= @"c:\temp\Run.exe";
            p.StartInfo.UseShellExecute = true;
            p.StartInfo.CreateNoWindow = true;
            p.Start();
            p.WaitForExit();            
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SycActualResult()
        {
            string testcase = System.IO.File.ReadAllText(@"c:\temp\TestCaseResult.Json", Encoding.UTF8);
            return Json(testcase, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UploadFile()
        {
            Request.Files[0].InputStream.Position = 0;
            StreamReader reader = new StreamReader(Request.Files[0].InputStream);
            string testcase = reader.ReadToEnd();
            return Json(testcase, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public void Export(string path) {
            Shared.Excel.JsonToDatatable js = new Shared.Excel.JsonToDatatable();
            //string jsonval = js.ReadJsonFile(path);
            Dictionary<string, object> prev = new Dictionary<string, object>();
            DataTable res = js.recursionToDataTable(js.JsontoArray(path), null, prev);
            
            js.ExportExcel(res, "ex.xls");
        }

        public string ReadExcel(string path)
        {
            Shared.Excel.JsonToDatatable js = new Shared.Excel.JsonToDatatable();
            DataTable res = js.ExcelToDataTable(path,true);
            string result = js.DataTabletoJson(res);
            return result;
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}