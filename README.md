# CSStats+

CSStats Plus is web extension that aims to enhance the user experience on the CSStats platform by providing better UI/UX features and additional functionalities.

<p>
	<a align="left" href="https://chromewebstore.google.com/detail/csstats-plus/koackgklhpaahkbncajeieppmfnelkeh" target="_blank">
		<img src="https://img.shields.io/chrome-web-store/v/koackgklhpaahkbncajeieppmfnelkeh?style=for-the-badge&logo=googlechrome&color=eee&logoColor=fff&labelColor=4285F4" />
	</a>
	&nbsp;
	<a align="left" href="https://addons.mozilla.org/en-US/firefox/addon/csstats-plus/" target="_blank">
		<img src="https://img.shields.io/amo/v/csstats-plus?style=for-the-badge&logo=firefoxbrowser&color=eee&logoColor=fff&labelColor=FF7139" />
	</a>
</p>

## Before and After comparison

### Player Profile Page
<details><summary>Main tab</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-after.png) |
|:--------:|:-------:|
| Before | After |

Match history enhancements:  
- You can now click on a match to directly access the match page on CSStats.

Most played/success maps improvements:
- All data is shown rather than just top 5 maps.
- Maps are now displayed with their full names instead of filenames.
- Data is properly sorted
- Map icons are displayed next to map names for better visual identification.
- You can now see both amount of matches played/won and the corresponding percentages.

Less cluttered ranks display:
- You can see previous Premier ranks by navigating through them with arrows.  
- Community Maps ranks are shown separately.
- You can click on any ranks to filter player's data by that rank type / maps in competitive mode.

Statistics charts:
- If a player has very high K/D or HLTV rating, the charts will turn orange to indicate irregular values.
- Improved visualization of all charts, making it easier to understand player performance.

</details>
<details><summary>Maps tab</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-maps-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-maps-after.png) |
|:--------:|:-------:|
| Before | After |

- Made the maps icons bigger and use SVG format when available for better quality.
- Map names are now displayed in full instead of using the map filenames, improving readability.

</details>
<details><summary>Matches tab</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-matches-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/player-matches-after.png) |
|:--------:|:-------:|
| Before | After |

- Competitive, Wingman and FACEIT ranks are now displayed using SVG images for better quality and scalability.
- Competitive and Wingman ranks now display the rank the player upped or downed to, instead of the final rank after the match.
- Map names are now displayed in full instead of using the map filenames, improving readability.
- Map icons are in SVG format when available, ensuring better visual quality.

</details>

### Matches
<details><summary>Expand</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-after.png) |
|:--------:|:-------:|
| Before | After |

- Wingman matches now show their average rank, fetched from the match page since it's not displayed by default.
- Average ranks icons for FACEIT, Competitive and Wingman matches are now displayed using SVG images for better quality and scalability.
- Map icons are now in SVG format when available, ensuring better visual quality.

</details>

### Match page

- Improved the match details header layout:
	- Set the map icon to SVG format, centered in the match details header;
	- Set the map name below the icon to full name;
	- Set the average rank icon below the map name.

- On match tie, the score blue color match the CSStats theme instead of being deep blue.

<ul>
<li><details><summary>Competitive</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-competitive-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-competitive-after.png) |
|:--------:|:-------:|
| Before | After |

- Rank up/downgrade are better displayed with arrows and the new/previous rank icon to illustrate the change;
- If a user has no rank, the "unknown rank" icon is now displayed instead of nothing.

</details></li>
<li><details><summary>Wingman</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-wingman-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-wingman-after.png) |
|:--------:|:-------:|
| Before | After |

- Rank up/downgrade are better displayed with arrows and the new/previous rank icon to illustrate the change;
- Ranks shown now use the Wingman rank icons instead of Competitive ones.
- If a user has no rank, the "unknown rank" icon is now displayed instead of nothing.

</details></li>
<li><details><summary>FACEIT</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-faceit-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-faceit-after.png) |
|:--------:|:-------:|
| Before | After |

- FACEIT Levels are now bigger and use SVG format for better quality.

</details></li>
<li><details><summary>Premier</summary>

| ![Before](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-premier-before.png) | ![After](https://raw.githubusercontent.com/Juknum/csstats-plus/refs/heads/main/media/screenshots/match-premier-after.png) |
|:--------:|:-------:|
| Before | After |

- If a user has no rank, the "---" empty state is now displayed instead of nothing.

</details></li>
</ul>