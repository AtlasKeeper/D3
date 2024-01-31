var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
var margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
},
width = 920 - margin.left - margin.right,
height = 630 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);

var y = d3.scaleTime().range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var timeFormat = d3.timeFormat('%M:%S');

var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));

var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top +margin.bottom)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(url)
  .then(data => {
    data.forEach(function (d) {
        d.Place = +d.Place;
        var.parsedTime = d.Time.split(':');
        d.TIme = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    x.domain([
        d3.min(data, function (d) {
          return d.year - 1;
        }),
        d3.max(data, function (d) {
          return d.year + 1;
        })
    ]);
    y.domain(
      d3.extent(data, function (d) {
        return d.time;
      })
    );

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');

    svg 
      .append('g')
      .attr('class', 'y axis')
      .attr('id', 'y-axis')
      .attr(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Best Time (minute)');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -160)
      .attr('y', -44)
      .style('font-size', 18)
      .text('Time in Minute');

    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', function (d) {
        return x(d.Year);
      })
      .attr('cy', function (d) {
        return y(d.Time);
      })
      .attr('data-xvalue', function (d) {
        return d.Year;
      })
      .attr('data-yvalue', function (d) {
        return d.Time.toISOString();
      })
      .style('fill', fucntion (d) {
        return color(d.Doping !== '');
      })
      .on('mouseover', function (event, d) {
        div.style('opacity', 0.9);
        div.attr('data-year', d.year);
        div
          .html(
            d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              timeFormat(d.Time) +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        div.style('opacity', 0);
      });
  })
