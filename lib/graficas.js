/*!
 * graficas.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 graficas.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function tablaAgraficaLineal(tabla)
{
if ($(tabla))
	{
	var tam=$(tabla).getParent('div').getSize();
	var anchura=Math.round(tam.x*0.95);
	var altura=Math.round(anchura*0.75);
	var chart = new MilkChart.Line(tabla,{'width':anchura,'height':altura});
	}
}

function tablaAgraficaBarras(tabla)
{
if ($(tabla))
	{
	var tam=$(tabla).getParent('div').getSize();
	var anchura=Math.round(tam.x*0.95);
	var altura=Math.round(anchura*0.75);
	var chart = new MilkChart.Column(tabla,{'width':anchura,'height':altura});
	}
}