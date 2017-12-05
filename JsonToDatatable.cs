using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;
using NPOI;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
namespace Shared.Excel
{
    public class JsonToDatatable
    {
        public string ReadJsonFile(string filepath)
        {
            return File.ReadAllText(filepath);
        }
        /// <summary>
        /// Convert Json to ArrayList
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public ArrayList JsontoArray(string json)
        {
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            javaScriptSerializer.MaxJsonLength = Int32.MaxValue;
            ArrayList arrayList = javaScriptSerializer.Deserialize<ArrayList>(json);
            return arrayList;
        }
        /// <summary>
        /// Can convert data like [{a:a,b:b,c:[{ca:ca,cb:cb,cc:[{cca:cca,ccb:ccb...}]}]}]
        /// </summary>
        /// <param name="arrayList"></param>
        /// <param name="dataTable"></param>
        /// <param name="prevobj"></param>
        /// <returns></returns>
        public DataTable recursionToDataTable(ArrayList arrayList, DataTable dataTable, Dictionary<string, object> prevobj)
        {
            JsonToDatatable jsclass = new JsonToDatatable();
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            if (dataTable == null)
            {
                dataTable = new DataTable();
            }
            DataTable result;
            Dictionary<string, object> prev = new Dictionary<string, object>();
            if (prevobj != null)
            {
                prev = prevobj;
            }
            try
            {
                if (arrayList.Count > 0)
                {
                    foreach (Dictionary<string, object> dictionary in arrayList)
                    {
                        if (dictionary.Keys.Count<string>() == 0)
                        {
                            result = dataTable;
                            return result;
                        }
                        //Columns
                        int listcount = 0;
                        foreach (string current in dictionary.Keys)
                        {
                            if (current != "scenarios" && current != "cases" && current != "steps")
                            {
                                if (dataTable.Columns.IndexOf(current) == -1)
                                {
                                    dataTable.Columns.Add(current, dictionary[current].GetType());
                                }

                                if (prev.ContainsKey(current))
                                {
                                    prev[current] = dictionary[current];
                                }
                                else
                                {
                                    prev.Add(current, dictionary[current]);
                                }
                            }
                            else
                            {
                                dataTable = jsclass.recursionToDataTable(javaScriptSerializer.Deserialize<ArrayList>(javaScriptSerializer.Serialize(dictionary[current])), dataTable, prev);
                                listcount++;
                            }
                        }
                        if (listcount == 0)
                        {
                            DataRow dataRow = dataTable.NewRow();
                            foreach (string val in prev.Keys)
                            {
                                dataRow[val] = prev[val];
                            }
                            dataTable.Rows.Add(dataRow);
                        }
                    }
                }
            }
            catch
            {
            }
            result = dataTable;
            return result;
        }

        public void ExportExcel(DataTable dt, string filename)
        {
            if (dt == null)
            {
                dt = new DataTable();
            }

            MemoryStream ms = new MemoryStream();
            HSSFWorkbook hssfworkbook = new HSSFWorkbook();
            ISheet sheet = hssfworkbook.CreateSheet(filename.Substring(0, filename.Length - 4));
            
            sheet.DisplayGridlines = false;
            
            IRow headrow = sheet.CreateRow(0);

            ICellStyle headStyle = hssfworkbook.CreateCellStyle();
            headStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            headStyle.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.White.Index;
            headStyle.FillPattern = FillPattern.LeastDots;
            headStyle.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.White.Index;
            headStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            headStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            headStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            headStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont fonta = hssfworkbook.CreateFont();
            fonta.Color = NPOI.HSSF.Util.HSSFColor.Black.Index;
            fonta.FontName = "Calibri";
            fonta.FontHeightInPoints = 11;
            fonta.Boldweight = (short)FontBoldWeight.Bold;
            headStyle.SetFont(fonta);
            
            foreach (DataColumn column in dt.Columns)
            {
                if (column.ColumnName == "PROMTSurveyComment1" || column.ColumnName == "PROMTSurveyComment2")
                {
                    headrow.CreateCell(column.Ordinal).SetCellValue("Comments");
                }
                else
                {
                    headrow.CreateCell(column.Ordinal).SetCellValue(column.ColumnName);
                }
                sheet.SetColumnWidth(column.Ordinal, 35 * 256);
         

                ICell cella = headrow.GetCell(column.Ordinal);
                cella.CellStyle = headStyle;
            }
            
            IRow Contentrow;
            ICellStyle contentStyle = hssfworkbook.CreateCellStyle();
            contentStyle.WrapText = true;
            contentStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;
            contentStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont fontb = hssfworkbook.CreateFont();
            fontb.FontName = "Calibri";
            fontb.FontHeightInPoints = 11;
            contentStyle.SetFont(fontb);

            ICellStyle contentStyle1 = hssfworkbook.CreateCellStyle();
            contentStyle1.WrapText = true;
            contentStyle1.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Right;
            contentStyle1.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle1.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle1.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            contentStyle1.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont fontb1 = hssfworkbook.CreateFont();
            fontb1.FontName = "Calibri";
            fontb1.FontHeightInPoints = 11;
            contentStyle1.SetFont(fontb1);


            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Contentrow = sheet.CreateRow(i + 1);
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if ((filename == "VisitSearch.xls" && (dt.Columns[j].ColumnName == "Visit Start Date" || dt.Columns[j].ColumnName == "Visit End Date" || dt.Columns[j].ColumnName == "Workspace Created Date" || dt.Columns[j].ColumnName == "Visit Created Date")) || ((filename == "OpenOpportunity.xls") && (dt.Columns[j].ColumnName == "Expected Contract Signing Date" || dt.Columns[j].ColumnName == "Expected Proposal Submission Date" || dt.Columns[j].ColumnName == "Opportunity Close Date" || dt.Columns[j].ColumnName == "SE Start Date" || dt.Columns[j].ColumnName == "SE End Date")) || ((filename == "ClosedOpportunity.xls") && (dt.Columns[j].ColumnName == "Expected Proposal Submission Date" || dt.Columns[j].ColumnName == "Expected Contract Signing Date" || dt.Columns[j].ColumnName == "Opportunity Close Date" || dt.Columns[j].ColumnName == "SE Start Date" || dt.Columns[j].ColumnName == "SE End Date")) || ((filename == "SearchPROMTOpportunity.xls") && (dt.Columns[j].ColumnName == "Expected Contract Signing Date" || dt.Columns[j].ColumnName == "Expected Proposal Submission Date" || dt.Columns[j].ColumnName == "Opportunity Close Date" || dt.Columns[j].ColumnName == "SE Start Date" || dt.Columns[j].ColumnName == "SE End Date")))
                    {
                        if (dt.Rows[i][j] != null && dt.Rows[i][j].ToString() != "")
                        {
                            NPOI.HSSF.UserModel.HSSFDataFormat dateFormat = (HSSFDataFormat)hssfworkbook.CreateDataFormat();
                            contentStyle.DataFormat = dateFormat.GetFormat("d-mmm-yy");

                            Contentrow.CreateCell(j).SetCellValue(Convert.ToDateTime(dt.Rows[i][j]));
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle;
                        }
                        else
                        {
                            Contentrow.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString());
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle;
                        }
                    }
                    else if (filename == "VisitSearch.xls" && (dt.Columns[j].ColumnName == "Internal Team Visitor Count" || dt.Columns[j].ColumnName == "Client Visitor Count"))
                    {
                        if (dt.Rows[i][j] != null && dt.Rows[i][j].ToString() != "")
                        {
                            Contentrow.CreateCell(j).SetCellValue(Convert.ToDouble(dt.Rows[i][j]));
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle1;
                        }
                        else
                        {
                            Contentrow.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString());
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle;
                        }
                    }
                    else if ((filename == "OpenOpportunity.xls" && dt.Columns[j].ColumnName == "Deal Value in (Thousand USD)") || (filename == "ClosedOpportunity.xls" && dt.Columns[j].ColumnName == "Deal Value in (Thousand USD)") || (filename == "SearchPROMTOpportunity.xls" && dt.Columns[j].ColumnName == "Deal Value in (Thousand USD)"))
                    {
                        if (dt.Rows[i][j] != null && dt.Rows[i][j].ToString() != "")
                        {
                            Contentrow.CreateCell(j).SetCellValue(Convert.ToDouble(dt.Rows[i][j]));
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle1;
                        }
                        else
                        {
                            Contentrow.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString());
                            ICell cellb = Contentrow.GetCell(j);
                            cellb.CellStyle = contentStyle;
                        }
                    }
                    else
                    {
                        Contentrow.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString());
                        ICell cellb = Contentrow.GetCell(j);
                        cellb.CellStyle = contentStyle;

                    }
                    
                }
            }

            try
            {
                hssfworkbook.Write(ms);
                ms.Flush();
                ms.Position = 0;
                System.Web.HttpContext.Current.Response.Buffer = false;
                System.Web.HttpContext.Current.Response.AddHeader("Connection", "Keep-Alive");
                System.Web.HttpContext.Current.Response.Charset = "UTF-8";
                System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
                System.Web.HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(filename, System.Text.Encoding.UTF8).ToString());
                System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
                System.Web.HttpContext.Current.Response.BinaryWrite(ms.ToArray());
                ms.Close();
                ms = null;
                System.Web.HttpContext.Current.Response.Flush();
                System.Web.HttpContext.Current.Response.Close();
            }
            catch {}
            finally
            {
                System.Web.HttpContext.Current.Response.Close();
            }
        }


        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <returns>返回的DataTable</returns>
        public DataTable ExcelToDataTable(string fileName, bool isFirstRowColumn)
        {
            ISheet sheet = null;
            DataTable data = new DataTable();
            int startRow = 0;
            IWorkbook workbook = null;
            FileStream fs = null;

            try
            {
                fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                    workbook = new XSSFWorkbook(fs);
                else if (fileName.IndexOf(".xls") > 0) // 2003版本
                    workbook = new HSSFWorkbook(fs);


                sheet = workbook.GetSheetAt(0);

                if (sheet != null)
                {
                    IRow firstRow = sheet.GetRow(0);
                    int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                    if (isFirstRowColumn)
                    {
                        for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                        {
                            ICell cell = firstRow.GetCell(i);
                            if (cell != null)
                            {
                                string cellValue = cell.StringCellValue;
                                if (cellValue != null)
                                {
                                    DataColumn column = new DataColumn(cellValue);
                                    data.Columns.Add(column);
                                }
                            }
                        }
                        startRow = sheet.FirstRowNum + 1;
                    }
                    else
                    {
                        startRow = sheet.FirstRowNum;
                    }

                    //最后一列的标号
                    int rowCount = sheet.LastRowNum;
                    for (int i = startRow; i <= rowCount; ++i)
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null) continue; //没有数据的行默认是null　　　　　　　

                        DataRow dataRow = data.NewRow();
                        for (int j = row.FirstCellNum; j < cellCount; ++j)
                        {
                            if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                                dataRow[j] = row.GetCell(j).ToString();
                        }
                        data.Rows.Add(dataRow);
                    }
                }

                return data;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return null;
            }
        }



        public ArrayList recursionToArrayList(ArrayList arrayList, DataRow dataRow, string flg)
        {
            JsonToDatatable jsclass = new JsonToDatatable();
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            Dictionary<string, object> dictionarymemory = new Dictionary<string, object>();
            int count = 0;
            foreach (Dictionary<string, object> dictionary in arrayList)
            {
               
                if (flg == "project")
                {
                    if (dictionary["project_air_id"].ToString() == dataRow["project_air_id"].ToString())
                    {
                        count++;
                    }
                }
                else if (flg == "scenarios")
                {
                    if (dictionary["scenario_id"].ToString() == dataRow["scenario_id"].ToString())
                    {
                        count++;
                    }
                }
                else if (flg == "cases")
                {
                    if (dictionary["case_id"].ToString() == dataRow["case_id"].ToString())
                    {
                        count++;
                    }
                }
            } 
            foreach (Dictionary<string, object> dictionary in arrayList)
            {
                dictionarymemory.Clear();
                foreach (string current in dictionary.Keys)
                {
                    dictionarymemory.Add(current, dictionary[current]);
                }

                foreach (string current in dictionary.Keys)
                {
                    if (current != "scenarios" && current != "cases" && current != "steps" && count==0)
                    {
                        dictionarymemory[current] = dataRow[current];
                    }
                    else
                    {
                        dictionarymemory[current] = jsclass.recursionToArrayList(javaScriptSerializer.Deserialize<ArrayList>(javaScriptSerializer.Serialize(dictionarymemory[current])), dataRow, current);
                    }
                }
                dictionary.Clear();
                foreach (string current in dictionarymemory.Keys)
                {
                    dictionary.Add(current, dictionarymemory[current]);
                }
            }
            return arrayList;
        }
        public string DataTabletoJson(DataTable dt)
        {
            string result = "";
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            ArrayList arr = JsontoArray(ReadJsonFile("C:\\temp\\TestCase_format.json"));
                foreach (DataRow row in dt.Rows)
                {
                    arr=recursionToArrayList(arr, row, "project");
                }
            result = javaScriptSerializer.Serialize(arr);
            return result;
        }
    }
}
