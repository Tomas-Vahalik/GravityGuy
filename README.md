# NI-APH - Tomáš Vahalík & Jakub Rathouský

## Spuštění hry
Před prvním spuštěním hry je potřeba provést
```
npm install
```
Poté se hra spustí příkazem
```
npm run dev
```
Ten spustí jednak jednoduchý backend server a následně i samotnou hru.


# Architektura hry
Jak již bylo zmíněno, ke hře jsme vytvořili jednoduchý Nodejs server, který příjimá HTTP požadavky pro uložení nového skóre (POST),
nebo pro vrácení seznamu všech dosažených bodů společně s přezdívkami hráčů, kteří jich dosáhli (GET). Server si dosažené skóre ulkádá pouze
in-memory, tedy při každém restartu se záznamy ztratí.

Samotná hra využívá ECS architekturu.
## Globální komponenty
Ve hře využíváme 4 globální komponenty:

**ECS Input Component** - pouze zaznamenává stisknutí kláves


**Input Manager** - zkoumá, která tlačítka jsou stiknutá a reaguje na to posíláním příslušných zpráv

**Komponenta se současnou scénou** - ve hře jsou 3 scény: vybrání přezdívky, zobrazení výsledků a samotná hra

**Load Manager** - má na starosti přepínání mezi scénami (starou odstraní, novou přidá)


## Herní objekty
Ve hře máme 4 druhy objektů :

**Hráč** - snaží se proběhnout celou trať

**Překážka** - objekty, po kterých se hráč pohybuje a může s nimi kolidovat

**Checkpoint** - po smrti (vypadnutí z trati) se hráč respawnuje u posledního proběhnutého checkpointu 

**Speciální efekt** - může být buď zrychlení hráče, nebo zpomalení času

Pro vytváření objektů jsme využili factory pattern.

## Důležité komponenty
Kolize řeší komponenty **Player collider** a **Obstacle collider**. Obstacle collider je komponenta,
kterou mají všechny objekty, se kterými může hráč přijít do styku - překážky, speciální efekty i checkpointy.
Každý update posílá pozici svého majitele. Komponenta Player collider na to reaguje a spočítá, jestli je hráč s daným objektem v kolizi.
Neřeší už ale, co se má v případě kolize stát. To má na starosti další komponenta.

Další důležitou komponentou je **Player movement**. Ta má na starosti hráčův pohyb - reagovat na změny gravitace a na kolize s objekty.
Dostává zprávy od collideru o kolizích, podívá se, s jakým objektem kolize nastala a provede příslušnou akci.

Poslední komponenta, kterou bychom chtěli zmínit je **Garbage removal**. Ta má na starost odstranit objekty, které vypadly ze scény.
Pokud vypadl hráč, pošle zprávu o tom, že by se měl načíst poslední checkpoint. Když vypadne něco jiného, tak daný objekt zničí,
aby se s ním zbytečně nepočítalo např. při zjišťování kolizí.
