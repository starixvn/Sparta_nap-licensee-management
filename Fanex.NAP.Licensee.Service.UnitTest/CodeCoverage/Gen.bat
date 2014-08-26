..\..\packages\OpenCover.4.5.2506\OpenCover.Console.exe -register:user -target:"..\..\packages\NUnit.Runners.2.6.3\tools\nunit-console.exe" -targetargs:"/noshadow ..\bin\Debug\Fanex.NAP.Licensee.Service.UnitTest.dll" -filter:+[*]* -output:"Data\coverage.xml"

..\..\packages\ReportGenerator.1.9.1.0\ReportGenerator.exe -reports:"Data\coverage.xml" -targetdir:"Report" 