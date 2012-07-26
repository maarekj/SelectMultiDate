SelectMultiDate
=====================

Plugin jQuery qui permet de sélectionner plusieurs dates à l'aide d'un datepicker

Auteur
---------------------
Joseph Maarek

Infomations connexes:
---------------------
Ce plugin utilise est un plugin jQuery (1.7.1). Il utilise le datepicker 
jQueryUI (1.8.16), et le plugin jquery.textext-1.3.0.
Ainsi qu'un thême customiser trouver sur le net de jQueryUI (avec
quelques ajouts pour les dates sélectionnées)

- [Doc de jQuery](http://docs.jquery.com/Main_Page)
- [Tuto pour faire un plugin jQuery](http://www.jquery.info/spip.php?article92)
- [Doc de jquery.textext](http://textextjs.com/)

Utilisation:
---------------------
    <div id="multi-date"></div>
    <script>
      $(function() {
        $('#multi-date').multiDate({
          culture:            'en',
          dateFormat:         'dd/mm/yy',
          maxDate:            0,
          enabledShortcuts:   true,
          disabledDayOfWeek:  [0, 6],
          disabledDates:      ['2012-07-14', '2012-08-05']
        })
        .bind('addedDate', function(e, date) {
          console.log(date);
        })
        .bind('clear', function(e, date) {
          console.log(date);
        })
        .multiDate('addDates', ['2012-04-06', '2012-06-19'])
       });
     </script>