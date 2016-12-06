/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package test;

/**
 * @author priand
 */
public abstract class TestsGenerator {

//	public static void main(String[] args) {
//		try {
//			generate("mobile-blue", "mainapp",IonicGeneratorExtension.THEME_BLUE);
//			generate("mobile-red", "mainapp",IonicGeneratorExtension.THEME_RED);
//			generate("mobile-yellow", "mainapp",IonicGeneratorExtension.THEME_YELLOW);
//		} catch(Exception ex) {
//			ex.printStackTrace();
//		}
//	}
//	public static void generate(String targetDir, String app, String theme) throws Exception {
//		String userDir = System.getProperty("user.dir");
//		System.out.println(userDir);		
//		String SOURCE = PathUtil.concat(userDir,"design");
//		final VFS sourceVFS = new VFSJavaFile(new File(SOURCE)); 
//		String TARGET = PathUtil.concat(userDir,"/src/main/resources/DARWINO-INF/resources",targetDir); 	
//		final VFS targetVFS = new VFSJavaFile(new File(TARGET));
//
//		GeneratorEntry e = new GeneratorEntry("", theme, app, targetDir, Mode.ERASE);
//		AppBuilder gen = new IonicAppBuilder(sourceVFS,targetVFS,e);
//
//		long start = System.currentTimeMillis();
//		boolean changes = gen.generate(new ProblemReporter.LogReporter(),null);
//		if(changes) {
//			long finish = System.currentTimeMillis();
//			Platform.log("Application generation completed, duration: {0}ms",(finish-start));
//		}
//	}
}
