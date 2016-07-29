/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.darwino.demo.dominodisc.watson;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.nav.JsonNav;
import com.darwino.commons.tasks.scheduler.TaskScheduler;
import com.darwino.commons.tasks.scheduler.schedulers.IntervalScheduler;
import com.darwino.commons.util.text.HtmlTextUtil;
import com.darwino.demo.dominodisc.app.AppDatabaseDef;
import com.darwino.ibm.watson.ToneAnalyzerFactory;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.ibm.watson.developer_cloud.tone_analyzer.v3_beta.ToneAnalyzer;
import com.ibm.watson.developer_cloud.tone_analyzer.v3_beta.model.ToneAnalysis;

/**
 * This class is used to analyze the content of the documents.
 */
public class AnalyzeTask extends BatchDocumentProcessor {

	// For debugging..
	private static final boolean FAKE = false;
	
	public static void install(String[] instances) {
		if(!Platform.getPropertyService().getPropertyBoolean("discdb.watson.analyzer")) {
			return;
		}
		// A service must exists
		ToneAnalyzerFactory factory = Platform.findServiceAsBeanUnchecked(ToneAnalyzerFactory.BEAN_TYPE, ToneAnalyzerFactory.class);
		if(factory==null) {
			Platform.log("Cannot find a factory for the Watson ToneAnalyzer service");
			return;
		}
		Platform.log("Start Watson Analyzer service");
		TaskScheduler sc = Platform.getService(TaskScheduler.class);
		IntervalScheduler scheduler = new IntervalScheduler();
		scheduler.setInterval("15s");
		scheduler.setInitialDelay("5s");
		
		BatchDocumentProcessorTask task = new BatchDocumentProcessorTask(new AnalyzeTask(factory,instances));
// >>>TEMP		
//		try {
//			task.getDocumentProcessor().resetAll();
//			task.getDocumentProcessor().resetAll(AppDatabaseDef.STORE_ANALYZE);
//		} catch (JsonException e) {
//			e.printStackTrace();
//		}
// <<<TEMP		
		sc.scheduleTask(task,scheduler);
	}

	private ToneAnalyzerFactory factory;
	
	public AnalyzeTask(ToneAnalyzerFactory factory, String[] instances) {
		super(AppDatabaseDef.DATABASE_NAME, AppDatabaseDef.STORE_NSFDATA, instances);
		this.factory = factory;
	}

	@Override
	public String getConfigUnid() {
		return "tone";
	}

	@Override
	protected int maxEntries() {
		// Prevent to many calls to the services
		return 32;
	}
	
	@Override
	public boolean handle(Document document) throws JsonException {
		Database db = document.getDatabase();

		final ToneAnalyzer ta = factory.createToneAnalyzer();

		// Tone Analyzer
		String bodyText = HtmlTextUtil.fromHTML(document.getString("body")); // Get the text only for sentiment analytics
		{
			if(!FAKE) {
				Document analyze = loadTargetDocument(document, getUpdateSession().getDatabase(db.getId(),db.getInstance().getId()).getStore(AppDatabaseDef.STORE_ANALYZE));
				if(analyze!=null) {
					Platform.log("Analyzing: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
					ToneAnalysis tone = ta.getTone(bodyText).execute();
					JsonObject json = transform(JsonObject.fromJson(tone.toString())); 
					//System.out.println(tone);
					//System.out.println(json);
					analyze.setJson(json);
					analyze.save();
				} else {
					Platform.log("** Skip analyzing: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
				}
			}
		}
		return true; // continue
	}
	
	private JsonObject transform(JsonObject o) throws JsonException {
		// The format returned by Watson os *not* query friendly so we do a little
		// transform, like:
//		{
//			  "document_tone": {
//			    "tone_categories": [
//			      {
//			        "category_id": "emotion_tone",
//			        "category_name": "Emotion Tone",
//			        "tones": [
//			          {
//			            "tone_id": "anger",
//			            "tone_name": "Anger",
//			            "score": 0.252124
//			          },
//			          {
//			            "tone_id": "disgust",
//			            "tone_name": "Disgust",
//			            "score": 0.350245
//			          },
//			          {
//			            "tone_id": "fear",
//			            "tone_name": "Fear",
//			            "score": 0.396718
//			          },
//			          {
//			            "tone_id": "joy",
//			            "tone_name": "Joy",
//			            "score": 0.280609
//			          },
//			          {
//			            "tone_id": "sadness",
//			            "tone_name": "Sadness",
//			            "score": 0.105251
//			          }
//			        ]
//			      },
//			      {
//			        "category_id": "writing_tone",
//			        "category_name": "Writing Tone",
//			        "tones": [
//			          {
//			            "tone_id": "analytical",
//			            "tone_name": "Analytical",
//			            "score": 0.0
//			          },
//			          {
//			            "tone_id": "confident",
//			            "tone_name": "Confident",
//			            "score": 0.0
//			          },
//			          {
//			            "tone_id": "tentative",
//			            "tone_name": "Tentative",
//			            "score": 0.0
//			          }
//			        ]
//			      },
//			      {
//			        "category_id": "social_tone",
//			        "category_name": "Social Tone",
//			        "tones": [
//			          {
//			            "tone_id": "openness_big5",
//			            "tone_name": "Openness",
//			            "score": 0.182
//			          },
//			          {
//			            "tone_id": "conscientiousness_big5",
//			            "tone_name": "Conscientiousness",
//			            "score": 0.13
//			          },
//			          {
//			            "tone_id": "extraversion_big5",
//			            "tone_name": "Extraversion",
//			            "score": 0.958
//			          },
//			          {
//			            "tone_id": "agreeableness_big5",
//			            "tone_name": "Agreeableness",
//			            "score": 0.986
//			          },
//			          {
//			            "tone_id": "neuroticism_big5",
//			            "tone_name": "Emotional Range",
//			            "score": 0.788
//			          }
//			        ]
//			      }
//			    ]
//			  }
//			}
//			{
//			  "emotion_tone": {
//			    "category_name": "Emotion Tone",
//			    "tones": {
//			      "joy": {
//			        "tone_name": "Joy",
//			        "score": 0.280609
//			      },
//			      "sadness": {
//			        "tone_name": "Sadness",
//			        "score": 0.105251
//			      },
//			      "disgust": {
//			        "tone_name": "Disgust",
//			        "score": 0.350245
//			      },
//			      "anger": {
//			        "tone_name": "Anger",
//			        "score": 0.252124
//			      },
//			      "fear": {
//			        "tone_name": "Fear",
//			        "score": 0.396718
//			      }
//			    }
//			  },
//			  "social_tone": {
//			    "category_name": "Social Tone",
//			    "tones": {
//			      "openness_big5": {
//			        "tone_name": "Openness",
//			        "score": 0.182
//			      },
//			      "conscientiousness_big5": {
//			        "tone_name": "Conscientiousness",
//			        "score": 0.13
//			      },
//			      "agreeableness_big5": {
//			        "tone_name": "Agreeableness",
//			        "score": 0.986
//			      },
//			      "neuroticism_big5": {
//			        "tone_name": "Emotional Range",
//			        "score": 0.788
//			      },
//			      "extraversion_big5": {
//			        "tone_name": "Extraversion",
//			        "score": 0.958
//			      }
//			    }
//			  },
//			  "writing_tone": {
//			    "category_name": "Writing Tone",
//			    "tones": {
//			      "analytical": {
//			        "tone_name": "Analytical",
//			        "score": 0
//			      },
//			      "confident": {
//			        "tone_name": "Confident",
//			        "score": 0
//			      },
//			      "tentative": {
//			        "tone_name": "Tentative",
//			        "score": 0
//			      }
//			    }
//			  }
//			}
		JsonNav j = JsonNav.create(o);

		JsonObject result = new JsonObject();

		// Add the initial object
		result.putAll(o);
		
		// And then a easier to query structure
		final JsonObject path = new JsonObject();
		result.put("byPath",path);
		j.get("document_tone").get("tone_categories").flatten().forEach(new JsonNav.Handler() {
			@Override
			public void handle(JsonNav nav) throws JsonException {
				JsonObject category = new JsonObject();
				category.put("category_name", nav.get("category_name").stringValue());
				final JsonObject tones = new JsonObject();
				category.put("tones",tones);
				nav.get("tones").flatten().forEach(new JsonNav.Handler() {
					@Override
					public void handle(JsonNav nav) throws JsonException {
						JsonObject tone = new JsonObject();
						tone.put("tone_name", nav.get("tone_name").stringValue());
						tone.put("score", nav.get("score").doubleValue());
						tones.put(nav.get("tone_id").stringValue(), tone);
					}
				});
				path.put(nav.get("category_id").stringValue(), category);
			}
		});
		
		return result;
    }
}
