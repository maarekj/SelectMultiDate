SelectMultiDate
================================================================================

Plugin jQuery qui permet de sélectionner plusieurs dates à l'aide d'un datepicker
[http://maarekj.github.com/SelectMultiDate/](http://maarekj.github.com/SelectMultiDate/)

Auteur
--------------------------------------------------------------------------------
Joseph Maarek

Infomations connexes:
--------------------------------------------------------------------------------
Ce plugin utilise est un plugin jQuery (1.7.1). Il utilise le datepicker 
jQueryUI (1.8.16), et le plugin jquery.textext-1.3.0.
Ainsi qu'un thême customiser trouver sur le net de jQueryUI (avec
quelques ajouts pour les dates sélectionnées)

- [Doc de jQuery](http://docs.jquery.com/Main_Page)
- [Tuto pour faire un plugin jQuery](http://www.jquery.info/spip.php?article92)
- [Doc de jquery.textext](http://textextjs.com/)

Exemples:
--------------------------------------------------------------------------------
[Voir un exemple](http://maarekj.github.com/SelectMultiDate/#exemple1)

Documentation:
--------------------------------------------------------------------------------
### Options ###

- culture: Possibilité de choisir la culture du widget
- dateFormat: Possibilité de choisir le format d'affichage
- maxDate: Possibilité de limité le nombre de date selectionnable
- enabledShortcuts: Active les raccourcies clavier:
    - Shift + Click => sélection/désélection du mois entier
    - Alt + Click => sélection/désélection de la semaine entière
    - Cmd/Ctrl => sélection/désélection de tout la colonne.
- disabledDayOfWeek: Désactive certaines jour de la semaine (un tableau 
    contenant les jours à désactivé, par exemple [0, 6] désactivera le dimanche
    et le lundi).
- disabledDates:  Désactive certaines dates précises, exemple:
  ['2012-07-14', '2012-08-05']

### Events ###
- addedDate: Quand une date est séléctionnée
- removedDate: Quand une date est supprimée.
- cleared: Quand le widget est vidé via la fonction clear.

### Functions ###
- addDates: Ajouter plusieurs dates.
- removeDates: Supprimer plusieurs dates.
- refresh: Met à jour le calendrier.
- getDates: Recupèrer les dates séléctionnées.
- clear: Vide le widget.

Utilisation:
--------------------------------------------------------------------------------
```javascript
    <div id="multi-date"></div>
    <script>
      $(function() {
        $('#multi-date').selectMultiDate({
          culture:            'fr',
          dateFormat:         'dd/mm/yy',
          maxDate:            0,
          enabledShortcuts:   true,
          disabledDayOfWeek:  [0, 6],
          disabledDates:      ['2012-07-14', '2012-08-05']
        })
        .on('addedDate', function(e, date) {
          console.log(date);
        })
        .selectMultiDate('addDates', ['2012-04-06', '2012-06-19'])
       });
     </script>
```