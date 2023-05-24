//https://www.robotstxt.org/robotstxt.html
User-agent;
Disallow:

<iframe width="960" srcdoc="<script>(function() {
    var XHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      this.xhr = new XHR();
      return this;
    }
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      if(__fileNames.indexOf(url) >= 0) {
        this.file = url;
        this.responseText = __files[url];
        if(url.indexOf(&quot;.xml&quot;) === url.length - 4) {
          try {
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(this.responseText, &quot;text/xml&quot;);
            this.responseXML = oDOM;
          } catch(e) {}
        }
        // we indicate that the request is done
        this.readyState = 4;
        this.status = 200;
      } else {
        // pass thru to the normal xhr
        this.xhr.open(method, url, async, user, password);
      }
    };
    window.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      if(this.file) return;
      return this.xhr.setRequestHeader(header, value);
    }
    window.XMLHttpRequest.prototype.abort = function() {
      return this.xhr.abort()
    }
    window.XMLHttpRequest.prototype.getAllResponseHeaders = function() {
      return this.xhr.getAllResponseHeaders();
    }
    window.XMLHttpRequest.prototype.getResponseHeader = function(header) {
      return this.xhr.getResponseHeader(header);
    }
    window.XMLHttpRequest.prototype.overrideMimeType = function(mime) {
      return this.xhr.overrideMimeType(mime);
    }
    window.XMLHttpRequest.prototype.send = function(data) {
      //we need to remap the fake XHR to the real one inside the onload/onreadystatechange functions
      var that = this;
      // unfortunately we need to do our copying of handlers in the next tick as
      // it seems with normal XHR you can add them after firing off send... which seems
      // unwise to do in the first place, but this is needed to support jQuery...
      setTimeout(function() {
        // we wire up all the listeners to the real XHR
        that.xhr.onerror = this.onerror;
        that.xhr.onprogress = this.onprogress;
        if(that.responseType || that.responseType === '')
            that.xhr.responseType = that.responseType
        // if the onload callback is used we need to copy over
        // the real response data to the fake object
        if(that.onload) {
          var onload = that.onload;
          that.xhr.onload = that.onload = function() {
            try{
              that.response = this.response;
              that.readyState = this.readyState;
              that.status = this.status;
              that.statusText = this.statusText;
            } catch(e) { console.log(&quot;onload&quot;, e) }
            try {
              if(that.responseType == '') {
                  that.responseXML = this.responseXML;
                  that.responseText = this.responseText;
              }
              if(that.responseType == 'text') {
                  that.responseText = this.responseText;
              }
            } catch(e) { console.log(&quot;onload responseText/XML&quot;, e) }
            onload();
          }
        }
        // if the readystate change callback is used we need
        // to copy over the real response data to our fake xhr instance
        if(that.onreadystatechange) {
          var ready = that.onreadystatechange;
          that.xhr.onreadystatechange = function() {
            try{
              that.readyState = this.readyState;
              that.responseText = this.responseText;
              that.responseXML = this.responseXML;
              that.responseType = this.responseType;
              that.status = this.status;
              that.statusText = this.statusText;
            } catch(e){
               console.log(&quot;e&quot;, e)
            }
            ready();
          }
        }
        // if this request is for a local file, we short-circuit and just
        // end the request, since all the data should be on our fake request object
        if(that.file) {
          if(that.onreadystatechange)
            return that.onreadystatechange();
          if(that.onload)
            return that.onload(); //untested
        }
        // if this is a real request, we pass through the send call
        that.xhr.send(data)
      }, 0)
    }

    var originalFetch = window.fetch;
    window.fetch = function(input, init) {
    
      var url = input;
      if (input instanceof Request) {
        url = input.url
      }
    
      // This is a hack that seems to fix a problem with the way Mapbox is requesting its TileJSON
      // Not sure what blob:// protocol is anyway...
      url = url.replace('blob://', 'http://')
        
      if(__fileNames.indexOf(url) >= 0) {
    
        var responseText = __files[url];
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'ok',
          url: url,
          text: function(){ return Promise.resolve(responseText) },
          json: function(){ return Promise.resolve(responseText).then(JSON.parse) },
          blob: function(){ return Promise.resolve(new Blob([responseText])) },
          // Inspired by https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
          arrayBuffer: function() {
            var buffer = new ArrayBuffer(responseText.length * 2);
            var bufferView = new Uint16Array(buffer);
            for (var i = 0, length = responseText.length; i < length; i++) {
              bufferView[i] = responseText.charCodeAt(i);
            }
            return Promise.resolve(buffer);
          }
        })
      }
    
      return originalFetch(input, init)
    }
    
  }
var __files = JSON.parse(decodeURIComponent(__filesURI));
var __fileNames = [&quot;dropdownMenu.js&quot;,&quot;lineChart.js&quot;,&quot;loadAndProcessData.js&quot;,&quot;colorLegend.js&quot;,&quot;index.js&quot;,&quot;README.md&quot;];</script>
<!DOCTYPE html>
<html>
  <head>
    <title>Multiple Line plot with Dropdown </title>
    <style>body {
  margin: 0px;
  overflow: hidden;
  background-color: #7c6d72;
}


text {
  font-family: sans-serif;
}


.tick line {
  stroke: #C0C0BB;
}

.axis-label {
  font-size: 2.4em;
  fill: #ede1e5;
}

.x-axis {
  font-size: 8px;
}

.y-axis {
  font-size: 8px;
}

.title {
  font-size: 1.65em;
  fill: #ede1e5;
} 

.tick text {
  cursor: default;
  fill: #ede1e5;
  font-size: 3em;  
}

.legend text {
  font-size: 1em;
  fill: #ede1e5;
  font-family: sans-serif;
}

.dataline {
  fill: none;
  opacity: 0.6;
  stroke-width: 5;
  stroke-linejoin: round;
}

.dataline.highlighted {
  stroke-width: 1.5px;
  stroke:black
 }

#menus {
  font-size: 2.5em;
  text-align: center;
}

#menus select {
  font-size: 1.5rem;
}

#menus select option {
  font-size: 1rem;
}</style>
    <script src=&quot;https://unpkg.com/d3@5.6.0/dist/d3.min.js&quot;></script>
    <script src=&quot;https://unpkg.com/topojson@3.0.2/dist/topojson.min.js&quot;></script>
  </head>
  <body>
    <div id =&quot;menus&quot;>
      <span id = &quot;y-menu&quot; > </span>
    </div>
    <svg width=&quot;960&quot; height=&quot;450&quot;></svg>
    <script>(function (d3) {
  'use strict';

  const dropdownMenu = (selection, props) => {
  	const {
        options,
        onOptionClicked,
        selectedOption
      } = props;
    
    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function() {
          onOptionClicked(this.value);
        });
    
    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
  };

  // load in and process data 


  const loadAndProcessData = () => 

  d3.csv('https://vizhub.com/KCachel/datasets/ExtendedPM25data.csv')
    .then(data => {
      data.forEach(d => {
        d.date = new Date(d.Date);
        d.year = +d.Year;
        d.NitricOxide = +d.NitricOxide;
        d.NitrogenDioxide = +d.NitrogenDioxide;
        d.OxidesofNitrogen = +d.OxidesofNitrogen;
        d.Ozone = +d.Ozone;
        d.PM10 = +d.PM10;
        d['PM2.5'] = +d['PM2.5'];
        d.SulphurDioxide = d.SulphurDioxide;
      });
     // console.log(data);
      
      return data;
    });

  const colorLegend = (selection, props) => {
    const {
      colorScale,
      circleRadius,
      spacing,
      textOffset
    } = props;

    const groups = selection.selectAll('g')
      .data(colorScale.domain());
    const groupsEnter = groups
      .enter().append('g')
        .attr('class', 'legend');
    groupsEnter
      .merge(groups)
        .attr('transform', (d, i) =>
          `translate(0, ${i * spacing})`
        );
    groups.exit().remove();

    groupsEnter.append('circle')
      .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale);

    groupsEnter.append('text')
      .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };

  const lineChart = (selection, props) => {
    
    const {
      data,
      colorScale,
      width,
      height,
      margin,
      title,
      xValue,
      xAxisLabel,
      yValue,
      yAxisLabel,
      colorValue,
      innerWidth,
      innerHeight,
    } = props;
    
    //console.log(title);
    

    
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g
      .enter().append('g')
        .attr('class', 'container');
    gEnter
      .merge(g)
        .attr('transform',
          `translate(${margin.left},${margin.top})`
        );
    
    gEnter.append('text')
      .merge(g.select('.title'))
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15)
      .tickFormat(d3.timeFormat('%b'));
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
      .append('g')
        .attr('class', 'y-axis');
    
    yAxisG.merge(yAxisGEnter)
        .call(yAxis)
      .selectAll('.domain').remove();

    yAxisGEnter.append('text')
      .attr('class', 'axis-label')
      .attr('y', -73)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);
    
      
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
      .append('g')
        .attr('class', 'x-axis');
    
    xAxisG
      .merge(xAxisGEnter)
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('domain').remove();
    
    xAxisGEnter.append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);
    
    
  /*   //make line to show limit #fc9f9c #9bc9ef
    gEnter.append(&quot;line&quot;)          
      .style(&quot;stroke&quot;, &quot;#9bc9ef&quot;)
      .style(&quot;stroke-width&quot;, 3.2)
      .attr(&quot;x1&quot;, 674)
      .attr(&quot;y1&quot;, yScale(10))
      .attr(&quot;x2&quot;, 674)
      .attr(&quot;y2&quot;, yScale(10)); 
    
    
    gEnter.append('text')
        //.attr('class', 'axis-label')
        .attr('y', yScale(10)+15)
        .attr('x', innerWidth / 2 - 330)
        .attr('fill', '#9bc9ef')
        .text(&quot;World Health Org. Limit&quot;);*/
    

  //////////////////line stuff

    const lineGenerator = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveBasis);

    const nested = d3.nest()
      .key(colorValue)
      .entries(data);
    
    
    const dataline = gEnter.merge(g)
      .selectAll('.dataline').data(nested);
    dataline
      .enter().append('path')
        .attr('class', 'dataline')
      .merge(dataline)
        .transition().duration(1500)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key));
    
  //   .dataline2 {
  //   fill: none;
  //   stroke: #fde0dd;
  //   opacity: 0.6;
  //   stroke-width: 5;
  //   stroke-linejoin: round;
  // }
    
    
   
    
    
  };

  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const lineChartG = svg.append('g');
  const colorLegendG = svg.append('g')
      .attr('transform',`translate(854,80)`);


  const colorScale = d3.scaleOrdinal()
    .domain(['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'])
    .range([
      '#fff7f3',
      '#fde0dd',
      '#fcc5c0',
      '#fa9fb5',
      '#f768a1',
      '#dd3497',
      '#ae017e',
      '#7a0177',
      '#49006a'
    ]);
    
  const margin = { top: 60, right: 130, bottom: 88, left: 150 };
  const innerWidth = width - margin.left - margin.right - 8;
  const innerHeight = height - margin.top - margin.bottom;

  let data;
  let xColumn;
  let yColumn;

  loadAndProcessData()
    .then(d => {
      data = d;
      xColumn = d.Date;
      yColumn = d.columns[6];
      render();
  });

  const onYColumnClicked = column => {
    yColumn = column;
    render();
  };

  const render = () => {
    
    // select('#x-menu')
    //   .call(dropdownMenu, {
    //     options: data.columns.filter(column =>
    //      // column !== 'Date' &amp;&amp;
    //       column !== 'Year' &amp;&amp;
    //       column != 'Month' 
    //     ),
    //     onOptionClicked: onXColumnClicked,
    //     selectedOption: xColumn
    //   });

    d3.select('#y-menu')
      .call(dropdownMenu, {
        options: data.columns.filter(column =>
          column !== 'date' &amp;&amp;
          column !== 'year' &amp;&amp;
          column !== 'Date' &amp;&amp;
          column !== 'Year'
        ),
        onOptionClicked: onYColumnClicked,
        selectedOption: yColumn
      });
    


      lineChartG.call(lineChart,{
        data,
        colorScale,
        width,
        height,
        margin,
        title: 'London Monthly Air Quality: '+ yColumn,
        xValue: d => d.date,
        xAxisLabel: 'Month',
        yValue: d => d[yColumn],
        colorValue: d => d.year,
        yAxisLabel: yColumn, 
        innerWidth,
        innerHeight
      });

    colorLegendG.call(colorLegend,{
        colorScale,
        circleRadius: 10,
        spacing: 25,
        textOffset: 20
    });
  };

}(d3));


  </body>
</html>" height="500" style="position: fixed; border: 0px; top: 0px; left: 0px; transform-origin: 0px 0px; z-index: 1; background-color: rgb(255, 255, 255); transition-property: transform; transition-timing-function: cubic-bezier(0.28, 0.66, 0.15, 1); box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px; transform: translate(106px, 80px) scale(0.979167); pointer-events: all;"></iframe>