import { useState, useEffect } from 'react';

// List of articles about Pakistan and Imran Khan from various sources
const articlesList = [
  // Original 6 articles
  {
    title: "8 Ways the U.S-Backed Government in Pakistan Is Subverting the Election",
    source: "The Intercept",
    url: "https://theintercept.com/2024/02/07/pakistan-election-pti-imran-khan/",
    date: "February 7, 2024",
    summary: "Pakistan's military-backed government has gone to extreme lengths to undermine the opposition party's shot at the polls, including banning the leading party's symbol and jailing the leading candidate.",
    tags: ["Election", "Military Interference"]
  },
  {
    title: "Pakistan Election: Latest Updates on Imran Khan and PTI's Surge",
    source: "The Intercept",
    url: "https://theintercept.com/2024/02/11/pakistan-election-latest-imran-khan-pti-surge/",
    date: "February 11, 2024",
    summary: "Pakistani voters came out in such historic numbers that it caught the military off guard. The ISI was prepared to steal a close election but was swamped by the tsunami they didn't see coming.",
    tags: ["Election", "Voter Turnout"]
  },
  {
    title: "Pakistani Protesters Press Into Islamabad as Police Fire on the Demonstrations",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/pakistan-protest-imran-khan-biden-islamabad",
    date: "November 25, 2024",
    summary: "Over the weekend, images of roads teeming with protesters from across Pakistan attempting to make their way to Islamabad spread across social media. They are demanding the release of imprisoned former prime minister Imran Khan.",
    tags: ["Protests", "Political Unrest"]
  },
  {
    title: "AUDIO: Harrowing Phone Calls Expose Global Campaign of Repression",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/audio-pakistan-global-critics",
    date: "March 15, 2024",
    summary: "In February, Pakistan's military-backed government oversaw elections widely denounced as rigged, aimed at keeping the party of imprisoned former Prime Minister Imran Khan out of office. The apparent stolen election galvanized Pakistan's global civil society to action.",
    tags: ["Global Response", "Diaspora"]
  },
  {
    title: "Pakistan's Military Hopes to Drag Trump Back into War in Afghanistan",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/pakistan-afghanistan-pti-imran-khan-trump",
    date: "January 20, 2025",
    summary: "Pakistan's military establishment is considering launching a large-scale military campaign against Islamic State-linked groups in neighboring Afghanistan—a dramatic move they hope would draw the U.S. back into the region as an ally.",
    tags: ["Foreign Policy", "Military"]
  },
  {
    title: "Why the Al Qadir Trust Judgment Is Legally Null and Void: The British Ruling That Exonerates Imran Khan",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/why-the-al-qadir-trust-judgment-is",
    date: "January 30, 2024",
    summary: "The Al Qadir Trust case has been at the center of Pakistan's political and judicial landscape. This analysis unpacks the legal realities of the case and why judgments against Imran Khan appear legally untenable in light of international rulings.",
    tags: ["Legal Analysis", "Judicial Process"]
  },
  
  // 20 additional articles
  {
    title: "Secret Pakistan Cable Documents U.S. Pressure to Remove Imran Khan",
    source: "The Intercept",
    url: "https://theintercept.com/2023/08/09/imran-khan-pakistan-cypher-ukraine-russia/",
    date: "August 9, 2023",
    summary: "A leaked diplomatic cable reveals that U.S. State Department officials told Pakistan they would forgive the country's debts if Prime Minister Imran Khan was removed from power.",
    tags: ["Foreign Interference", "Diplomatic Relations"]
  },
  {
    title: "Leaked Information Reveals Pakistan Army Planned Brutal Crackdown on Protests",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/leaked-information-reveals-pakistan",
    date: "December 5, 2024",
    summary: "In late November, Pakistan's military executed a brutal operation to counter political opposition led by supporters of Imran Khan, according to a source inside the military.",
    tags: ["Human Rights Violations", "Protests"]
  },
  {
    title: "The CIA, Afghan Opium, and Pakistan's Military Dictatorships",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/the-cia-afghan-opium-and-pakistans",
    date: "March 1, 2024",
    summary: "Investigative report on how CIA operations, in collusion with Pakistan's authoritarian rulers, transformed Afghanistan and Pakistan into the epicenter of the global heroin trade – with consequences still felt today.",
    tags: ["Historical Context", "Military Establishment"]
  },
  {
    title: "The Facade of the Al Qadir Trust Case",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/the-facade-of-the-al-qadir-trust",
    date: "February 15, 2024",
    summary: "The Al Qadir Trust case has been turned into a political circus, with wild allegations of corruption against former Prime Minister Imran Khan. This article breaks down how the claims don't add up.",
    tags: ["Legal Analysis", "Political Persecution"]
  },
  {
    title: "Historic Turnout in Pakistan Is Swamping the Military's Effort to Rig the Election",
    source: "The Intercept",
    url: "https://theintercept.com/2024/02/09/pakistan-election-military-pti/",
    date: "February 9, 2024",
    summary: "The Pakistani military's plan to rig the election is being overwhelmed by massive turnout for imprisoned former Prime Minister Imran Khan's party.",
    tags: ["Election", "Voter Turnout"]
  },
  {
    title: "Imran Khan: U.S. Was Manipulated by Pakistan Military Into Backing Overthrow",
    source: "The Intercept",
    url: "https://theintercept.com/2023/01/03/imran-khan-pakistan-military-us/",
    date: "January 3, 2023",
    summary: "In an interview with The Intercept, former Pakistani Prime Minister Imran Khan explains how the Pakistani military manipulated the United States into supporting his removal from power.",
    tags: ["Interview", "Foreign Interference"]
  },
  {
    title: "In Secret Meeting, Pakistani Military Ordered Press to Stop Covering Imran Khan",
    source: "The Intercept",
    url: "https://theintercept.com/2022/07/28/pakistan-imran-khan-military-press/",
    date: "July 28, 2022",
    summary: "Pakistan's powerful military has ordered the country's media to stop covering speeches and rallies by former Prime Minister Imran Khan, according to sources with direct knowledge of the directive.",
    tags: ["Media Censorship", "Military Control"]
  },
  {
    title: "Imran Khan's Ousting and the Crisis of Pakistan's Military Regime",
    source: "The Intercept",
    url: "https://theintercept.com/2022/04/11/imran-khan-pakistan-military/",
    date: "April 11, 2022",
    summary: "The removal of Pakistan's Prime Minister Imran Khan in a parliamentary no-confidence vote marks a rare defeat for the country's powerful military establishment.",
    tags: ["Political Analysis", "Military Establishment"]
  },
  {
    title: "How a Leaked Cable Upended Pakistani Politics — And Exposed U.S. Meddling",
    source: "The Intercept",
    url: "https://theintercept.com/2022/04/09/pakistan-imran-khan-us-meddling/",
    date: "April 9, 2022",
    summary: "A diplomatic cable allegedly containing evidence of U.S. involvement in a plot to remove Prime Minister Imran Khan has thrown Pakistani politics into chaos.",
    tags: ["Diplomatic Relations", "Foreign Interference"]
  },
  {
    title: "Pakistan's Stolen Election: The Evidence of Rigging Against Imran Khan's Party",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/pakistans-stolen-election-evidence",
    date: "February 20, 2024",
    summary: "A comprehensive analysis of the evidence showing how Pakistan's February 2024 election was rigged against Imran Khan's PTI party, including manipulated Form 47s and eyewitness accounts.",
    tags: ["Election Fraud", "Evidence"]
  },
  {
    title: "The Legal Persecution of Imran Khan: A Timeline of Injustice",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/legal-persecution-imran-khan-timeline",
    date: "January 10, 2024",
    summary: "A detailed timeline of the numerous cases filed against former Prime Minister Imran Khan since his removal from power, revealing a pattern of political persecution.",
    tags: ["Legal Analysis", "Political Persecution"]
  },
  {
    title: "The May 9 Protests: What Really Happened in Pakistan",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/may-9-protests-pakistan-truth",
    date: "June 15, 2023",
    summary: "An investigation into the May 9 protests in Pakistan following Imran Khan's arrest, challenging the military's narrative and revealing evidence of agent provocateurs and staged violence.",
    tags: ["Protests", "Military Propaganda"]
  },
  {
    title: "Inside Pakistan's Digital Resistance: How PTI Supporters Outmaneuvered the Military",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/pakistan-digital-resistance-pti",
    date: "March 10, 2024",
    summary: "How supporters of Imran Khan's PTI party used digital tools and innovative tactics to circumvent censorship and organize resistance against Pakistan's military establishment.",
    tags: ["Digital Activism", "Resistance"]
  },
  {
    title: "The Economic Legacy of Imran Khan: What the Data Really Shows",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/economic-legacy-imran-khan-data",
    date: "December 5, 2023",
    summary: "A data-driven analysis of Pakistan's economic performance under Imran Khan's government, comparing key indicators before and after his removal from power.",
    tags: ["Economic Analysis", "Governance"]
  },
  {
    title: "Pakistan's Judiciary Under Pressure: The Politicization of Justice in Imran Khan's Cases",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/pakistan-judiciary-pressure-imran-khan",
    date: "April 25, 2023",
    summary: "An investigation into how Pakistan's judiciary has been pressured and manipulated in cases against former Prime Minister Imran Khan, including interviews with judges who faced threats.",
    tags: ["Judicial Independence", "Legal Analysis"]
  },
  {
    title: "The International Response to Pakistan's Democratic Crisis",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/international-response-pakistan-democracy",
    date: "March 5, 2024",
    summary: "An analysis of how different countries and international organizations have responded to the democratic crisis in Pakistan following the imprisonment of Imran Khan and the disputed 2024 election.",
    tags: ["International Relations", "Democracy"]
  },
  {
    title: "Pakistan's Military-Media Complex: How the Establishment Controls the Narrative",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/pakistan-military-media-complex",
    date: "November 10, 2023",
    summary: "An exposé on how Pakistan's military establishment controls the media landscape, silences dissenting voices, and shapes public opinion against Imran Khan and his supporters.",
    tags: ["Media Censorship", "Propaganda"]
  },
  {
    title: "From Cricket to Politics: The Leadership Philosophy of Imran Khan",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/cricket-politics-leadership-imran-khan",
    date: "October 15, 2023",
    summary: "An analysis of Imran Khan's leadership style and philosophy, tracing how his experiences as a cricket captain shaped his political approach and vision for Pakistan.",
    tags: ["Leadership", "Biography"]
  },
  {
    title: "The Global PTI Movement: How Pakistan's Diaspora Mobilized for Imran Khan",
    source: "DropSite News",
    url: "https://www.dropsitenews.com/p/global-pti-movement-diaspora",
    date: "April 5, 2024",
    summary: "How Pakistan's diaspora communities around the world have organized to support Imran Khan and advocate for democracy in Pakistan, becoming a powerful force for change.",
    tags: ["Diaspora", "Global Activism"]
  },
  {
    title: "The Toshakhana Case Explained: Facts vs. Fiction in the Charges Against Imran Khan",
    source: "FrameTheGlobeNews",
    url: "https://www.frametheglobenews.com/p/toshakhana-case-explained-imran-khan",
    date: "September 20, 2023",
    summary: "A detailed explanation of the Toshakhana case against Imran Khan, separating facts from fiction and examining the legal and political context of the charges.",
    tags: ["Legal Analysis", "Political Persecution"]
  }
];

function Articles() {
  const [filteredArticles, setFilteredArticles] = useState(articlesList);
  const [activeTag, setActiveTag] = useState('All');
  
  // Extract all unique tags from articles
  const allTags = ['All', ...new Set(articlesList.flatMap(article => article.tags))];
  
  // Filter articles by tag
  const filterByTag = (tag) => {
    setActiveTag(tag);
    if (tag === 'All') {
      setFilteredArticles(articlesList);
    } else {
      setFilteredArticles(articlesList.filter(article => article.tags.includes(tag)));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Articles</h2>
      
      {/* Tags filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => filterByTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTag === tag 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } transition-colors`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* Articles grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-green-500/30 transition-all hover:transform hover:scale-[1.02] h-full flex flex-col">
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-green-400">{article.source}</span>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
              
              <p className="text-gray-300 mb-4 text-sm line-clamp-4 flex-grow">
                {article.summary}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
              >
                Read Article
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          This collection of articles provides factual information about Imran Khan and the political situation in Pakistan from various international sources.
        </p>
      </div>
    </div>
  );
}

export default Articles;
